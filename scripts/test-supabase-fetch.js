// Test script to verify Supabase data fetching
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseFetch() {
  console.log('=== SUPABASE DATA FETCH TEST ===');

  try {
    // Create Supabase client with service key for admin access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials in .env.local file');
      return;
    }

    console.log(`Connecting to Supabase at: ${supabaseUrl}`);
    console.log(`Using service key (first 10 chars): ${supabaseServiceKey.substring(0, 10)}...`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test connection by fetching sources
    console.log('\nFetching sources from database...');
    const { data: sources, error } = await supabase
      .from('sources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sources:', error);
      return;
    }

    console.log(`Successfully fetched ${sources.length} sources`);

    if (sources.length > 0) {
      console.log('\nFirst source details:');
      const firstSource = sources[0];
      console.log(`- ID: ${firstSource.id}`);
      console.log(`- Name: ${firstSource.name}`);
      console.log(`- Type: ${firstSource.source_type}`);
      console.log(`- Status: ${firstSource.connection_status}`);
      console.log(`- User ID: ${firstSource.user_id}`);
      console.log(`- Created: ${new Date(firstSource.created_at).toLocaleString()}`);

      if (firstSource.source_type === 'shopify' && firstSource.credentials?.shop) {
        console.log(`- Shopify Store: ${firstSource.credentials.shop}`);
      }
    } else {
      console.log('No sources found in the database');
    }

    // Test fetching users
    console.log('\nFetching users from database...');
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (userError) {
      console.error('Error fetching users:', userError);
      return;
    }

    console.log(`Successfully fetched ${users.length} users`);

    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testSupabaseFetch();