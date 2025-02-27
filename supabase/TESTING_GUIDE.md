# Testing the Supabase Integration

This guide will help you test the Supabase integration in your FlowTechs application.

## Prerequisites

Before testing, make sure:
1. You've applied the database migrations ([see guide](./APPLY_MIGRATIONS.md))
2. Set up Google OAuth if you want to test that authentication method ([see guide](./GOOGLE_OAUTH_SETUP.md))
3. Your FlowTechs application is running locally (`npm run dev`)

## Test 1: User Registration and Login

### Email/Password Registration

1. Navigate to `/register` in your application
2. Fill out the registration form with:
   - Full Name: `Test User`
   - Email: Use a real email you can access
   - Password: Create a strong password
3. Submit the form
4. You should be redirected to the verification page
5. Check your email for a verification link
6. Click the verification link
7. You should be redirected to the application and logged in

### Email/Password Login

1. Navigate to `/login` in your application
2. Enter the email and password you used for registration
3. Click "Sign in"
4. You should be redirected to the dashboard

### Google OAuth Login

1. Navigate to `/login` in your application
2. Click "Continue with Google"
3. If you're not already logged into Google, you'll be prompted to log in
4. Select or confirm your Google account
5. You should be redirected back to your application and logged in

## Test 2: User Profile

1. After logging in, navigate to the settings or profile page
2. Verify that your user information is displayed correctly
3. Try updating your profile information:
   - Change your name
   - Upload a profile picture (if implemented)
4. Save the changes
5. Refresh the page and verify that your changes persisted

## Test 3: Creating a Source

1. Navigate to the Sources page
2. Click "Add Source" or a similar button
3. Fill in the source creation form:
   - Name: `Test Shopify Store`
   - Type: Select `Shopify`
   - For credentials, use test values:
     ```json
     {
       "shop": "test-store.myshopify.com",
       "accessToken": "test_token_123456789"
     }
     ```
4. Submit the form
5. Verify that the new source appears in your sources list
6. Click on the source to view its details

## Test 4: Creating a Transformation

1. Navigate to the Transformations page
2. Click "Add Transformation" or a similar button
3. Fill in the transformation creation form:
   - Name: `Test Product Transformation`
   - Description: `Converts Shopify products to standard format`
   - Type: Select `Product`
   - Source: Select the Shopify source you created earlier
   - For configuration, use test values:
     ```json
     {
       "fields": ["title", "description", "price"],
       "format": "standard"
     }
     ```
4. Submit the form
5. Verify that the new transformation appears in your transformations list

## Test 5: Creating a Destination

1. Navigate to the Destinations page
2. Click "Add Destination" or a similar button
3. Fill in the destination creation form:
   - Name: `Test JSON Export`
   - Type: Select `JSON`
   - For credentials, use test values:
     ```json
     {
       "export_path": "/tmp/test-export",
       "filename_format": "products-%date%.json"
     }
     ```
4. Submit the form
5. Verify that the new destination appears in your destinations list

## Test 6: Row Level Security (RLS)

To test that Row Level Security is working properly:

1. Create a second user account
2. Log in with the second account
3. Navigate to the Sources, Transformations, and Destinations pages
4. Verify that you don't see any of the items created with the first account
5. Create a new item with the second account
6. Log out and log back in with the first account
7. Verify that you don't see the item created with the second account

## Test 7: API Endpoints

You can test the API endpoints using tools like Postman or curl:

### Getting Sources (Authenticated)

```bash
curl -X GET "http://localhost:3000/api/sources" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

Replace `YOUR_AUTH_TOKEN` with a valid token from your browser's localStorage or cookies after logging in.

### Creating a Source (Authenticated)

```bash
curl -X POST "http://localhost:3000/api/sources" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "name": "API Test Store",
    "type": "shopify",
    "credentials": {
      "shop": "api-test.myshopify.com",
      "accessToken": "api_test_token_123456"
    }
  }'
```

## Troubleshooting

If you encounter issues:

1. **Authentication Issues**:
   - Check the browser console for errors
   - Verify your Supabase credentials in `.env.local`
   - Ensure cookies are enabled in your browser

2. **Database Issues**:
   - Verify migrations were applied correctly in the Supabase dashboard
   - Check RLS policies in the Auth > Policies section

3. **API Issues**:
   - Check the browser network tab for request/response details
   - Verify the correct headers are being sent
   - Check server logs for error messages

## Next Steps

Once you've verified that all components are working correctly:

1. Customize the UI to match your branding
2. Implement additional features specific to your use case
3. Set up proper error handling and monitoring for production
4. Create automated tests to maintain reliability