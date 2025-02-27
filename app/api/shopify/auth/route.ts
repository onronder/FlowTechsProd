import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Environment variables
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`
  : 'http://localhost:3000/api/shopify/callback';

// Add export const dynamic = 'force-dynamic' to make this route dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Extract the shop parameter from the request
    const { searchParams } = new URL(request.url);
    const shop = searchParams.get('shop');

    console.log(`Shopify auth request for shop: ${shop}`);

    // Validate shop parameter
    if (!shop) {
      console.error('Missing shop parameter in Shopify auth request');
      return NextResponse.json(
        { error: 'Missing shop parameter' },
        { status: 400 }
      );
    }

    // Validate shop URL format
    if (!shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
      console.error(`Invalid shop URL format: ${shop}`);
      return NextResponse.json(
        { error: 'Invalid shop URL format. Must be a .myshopify.com domain' },
        { status: 400 }
      );
    }

    // Log API key information (without revealing the full key)
    console.log(`Using Shopify API key: ${SHOPIFY_API_KEY ? SHOPIFY_API_KEY.substring(0, 6) + '...' : 'Missing'}`);
    console.log(`Redirect URI: ${REDIRECT_URI}`);

    // Generate a nonce state parameter to prevent CSRF attacks
    const state = crypto.randomBytes(16).toString('hex');
    console.log(`Generated state nonce: ${state}`);

    // Define the scopes required for the app
    const scopes = 'read_products,read_orders,read_customers,read_inventory';

    // Construct the authorization URL
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    console.log(`Authorization URL created: ${authUrl.substring(0, 100)}...`);

    // Set a cookie with the state parameter for validation in the callback
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('shopify_oauth_state', state, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 minutes
    });

    console.log(`Setting state cookie and redirecting to Shopify`);
    return response;
  } catch (error) {
    console.error('Error in Shopify auth route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}