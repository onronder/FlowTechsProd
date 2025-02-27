// Script to create a test source in the database
// Run with: node scripts/create-test-source.js

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

async function createTestSource() {
  try {
    // Create Supabase client with service key for admin access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY // Use service key to bypass RLS
    );

    // Generate a random UUID for the source
    const sourceId = uuidv4();

    // Create a test user if needed
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    // Use the first user ID or create a new one
    let userId;
    if (users && users.length > 0) {
      userId = users[0].id;
      console.log('Using existing user ID:', userId);
    } else {
      // Create a test user
      const testUserId = uuidv4();
      const { error: userError } = await supabase
        .from('profiles')
        .insert({
          id: testUserId,
          email: 'test@example.com',
          full_name: 'Test User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (userError) {
        console.error('Error creating test user:', userError);
        return;
      }

      userId = testUserId;
      console.log('Created new test user with ID:', userId);
    }

    // Create the test source
    const { data, error } = await supabase
      .from('sources')
      .insert({
        id: sourceId,
        name: 'Test Shopify Store',
        source_type: 'shopify',
        connection_status: 'active',
        credentials: {
          shop: 'test-store.myshopify.com',
          access_token: 'fake-token-for-testing'
        },
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error creating test source:', error);
      return;
    }

    console.log('Successfully created test source:', data);
    console.log('Source ID:', sourceId);
    console.log('User ID:', userId);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestSource();