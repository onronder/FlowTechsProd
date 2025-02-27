# Shopify Integration Guide

This guide explains how to set up and use the Shopify integration in FlowTechs.

## Prerequisites

1. A Shopify Partner account
2. A custom app created in your Shopify Partner dashboard
3. FlowTechs application running locally or deployed

## Setting Up Shopify App Credentials

1. Go to your [Shopify Partners Dashboard](https://partners.shopify.com/)
2. Navigate to "Apps" and create a new app or select an existing one
3. In the app settings, find the "App credentials" section
4. Copy the API Key and API Secret Key
5. Set up the following redirect URL: `https://your-domain.com/api/shopify/callback` (replace with your actual domain)

## Environment Configuration

Add the following environment variables to your `.env.local` file:

```
SHOPIFY_API_KEY=your_api_key_from_shopify
SHOPIFY_API_SECRET=your_api_secret_from_shopify
SHOPIFY_REDIRECT_URI=https://your-domain.com/api/shopify/callback
```

## OAuth Flow

The Shopify integration uses the OAuth 2.0 flow:

1. User enters their Shopify store URL in the "Add Source" modal
2. User is redirected to Shopify for authorization
3. After authorization, Shopify redirects back to our callback URL
4. The callback handler exchanges the authorization code for an access token
5. The access token is stored securely and used for subsequent API calls

## API Endpoints

The Shopify integration includes the following API endpoints:

- `/api/shopify/auth`: Initiates the OAuth flow
- `/api/shopify/callback`: Handles the OAuth callback and token exchange

## Development Notes

When testing locally:
- Use `http://localhost:3000/api/shopify/callback` as your redirect URI
- You may need to use a tool like ngrok to expose your local server with HTTPS

## Troubleshooting

Common issues:

1. **Invalid HMAC error**: Ensure your API secret is correctly set in your environment variables
2. **Invalid redirect URI**: The redirect URI in your app settings must exactly match the one used in your application
3. **Access scope issues**: If you need additional permissions, update the SCOPES constant in the auth API route

## Security Considerations

- Store access tokens securely in a database
- Implement token refresh logic
- Use HTTPS in production
- Validate all incoming requests with HMAC verification