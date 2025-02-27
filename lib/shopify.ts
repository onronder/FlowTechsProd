import { cookies } from 'next/headers';

// Shopify API configuration
const SHOPIFY_API_VERSION = '2024-01'; // Use the latest stable version

/**
 * Check if a Shopify session is valid
 */
export const hasValidShopifySession = (): { valid: boolean; shop?: string } => {
  const cookieStore = cookies();
  const shopifyToken = cookieStore.get('shopify_token')?.value;
  const shopifyShop = cookieStore.get('shopify_shop')?.value;

  if (!shopifyToken || !shopifyShop) {
    return { valid: false };
  }

  return { valid: true, shop: shopifyShop };
};

/**
 * Fetch data from Shopify API using GraphQL
 */
export const queryShopifyGraphQL = async (
  query: string,
  variables?: Record<string, any>
): Promise<any> => {
  const { valid, shop } = hasValidShopifySession();

  if (!valid || !shop) {
    throw new Error('Invalid Shopify session');
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get('shopify_token')?.value;

  if (!accessToken) {
    throw new Error('Shopify access token not found');
  }

  const response = await fetch(`https://${shop}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify GraphQL error: ${errorText}`);
  }

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(errors)}`);
  }

  return data;
};

/**
 * Fetch data from Shopify REST API
 */
export const fetchShopifyREST = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<any> => {
  const { valid, shop } = hasValidShopifySession();

  if (!valid || !shop) {
    throw new Error('Invalid Shopify session');
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get('shopify_token')?.value;

  if (!accessToken) {
    throw new Error('Shopify access token not found');
  }

  const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify REST error: ${errorText}`);
  }

  return response.json();
};

/**
 * Fetch Shopify shop info
 */
export const getShopInfo = async () => {
  const query = `
    query {
      shop {
        id
        name
        email
        url
        myshopifyDomain
        primaryDomain {
          url
          host
        }
        plan {
          displayName
          partnerDevelopment
          shopifyPlus
        }
      }
    }
  `;

  return queryShopifyGraphQL(query);
};

/**
 * Get Shopify products
 */
export const getShopifyProducts = async (first: number = 10, after?: string) => {
  const query = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            id
            title
            handle
            description
            createdAt
            updatedAt
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price
                  sku
                  inventoryQuantity
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  return queryShopifyGraphQL(query, { first, after });
};