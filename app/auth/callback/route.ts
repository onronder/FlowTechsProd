import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { routes } from '@/lib/routes'
import { syncUserProfile } from '@/lib/supabase/helpers'

// This route handles the callback from Supabase Auth (OAuth providers and email links)
export async function GET(request: NextRequest) {
  console.log('=== AUTH CALLBACK STARTED ===')
  const requestUrl = new URL(request.url)
  console.log('Request URL:', requestUrl.toString())
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // If there's an error in the query params, redirect to login with the error
  if (error) {
    console.error(`Auth callback error: ${error} - ${errorDescription}`)
    return NextResponse.redirect(
      new URL(`${routes.auth.login}?error=${error}&error_description=${errorDescription}`,
        requestUrl.origin)
    )
  }

  if (code) {
    console.log('Auth code received, creating Supabase client')
    const supabase = createClient()
    const adminClient = createAdminClient() // Create admin client for DB operations

    try {
      console.log('Exchanging code for session')
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(
          new URL(`${routes.auth.login}?error=session_error&error_description=${error.message}`,
            requestUrl.origin)
        )
      }

      if (!data?.user) {
        console.error('No user data returned from exchangeCodeForSession')
        return NextResponse.redirect(
          new URL(`${routes.auth.login}?error=no_user&error_description=No user data returned`,
            requestUrl.origin)
        )
      }

      console.log('Auth successful for provider:', data.user.app_metadata.provider)
      console.log('User ID:', data.user.id)
      console.log('Email:', data.user.email)
      console.log('User metadata:', JSON.stringify(data.user.user_metadata, null, 2))

      try {
        // First, check if profile already exists - using admin client for higher privileges
        console.log('Checking if profile exists (using admin client)')
        const { data: existingProfile, error: profileError } = await adminClient
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.log('Error checking for existing profile:', profileError)
          // This could be "not found" error which is expected for new users
        }

        // If profile doesn't exist, create it directly instead of relying on triggers
        if (!existingProfile) {
          console.log('No existing profile found, creating directly (using admin client)')

          // Extract profile data
          const profileData = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              (data.user.user_metadata?.given_name && data.user.user_metadata?.family_name ?
                `${data.user.user_metadata.given_name} ${data.user.user_metadata.family_name}` : ''),
            avatar_url: data.user.user_metadata?.avatar_url ||
              data.user.user_metadata?.picture ||
              '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          console.log('Prepared profile data:', JSON.stringify(profileData, null, 2))

          try {
            // Try first with the admin client for higher privileges
            console.log('Inserting profile data with admin client')
            const { error: insertError, data: insertData } = await adminClient
              .from('profiles')
              .insert(profileData)
              .select();

            if (insertError) {
              console.error('Error creating profile with admin client:', insertError)
              console.error('Error details:', JSON.stringify(insertError, null, 2))
              console.log('Falling back to regular client...')

              // Fallback to regular client if admin fails
              const { error: regularInsertError, data: regularInsertData } = await supabase
                .from('profiles')
                .insert(profileData)
                .select();

              if (regularInsertError) {
                console.error('Error creating profile with regular client:', regularInsertError)
                console.error('Error details:', JSON.stringify(regularInsertError, null, 2))
                // Log detailed error, but continue - don't block login
              } else {
                console.log('Profile created successfully with regular client:', regularInsertData)
              }
            } else {
              console.log('Profile created successfully with admin client:', insertData)
            }
          } catch (insertCatchError: any) {
            console.error('Exception during profile insertion:', insertCatchError)
            console.error('Error stack:', insertCatchError.stack)
          }
        } else {
          console.log('Profile exists, updating with latest metadata (using admin client)')
          // Profile exists, let's update it with latest metadata
          try {
            // First try with admin client
            const { error: updateError } = await adminClient
              .from('profiles')
              .update({
                email: data.user.email || '',
                full_name: data.user.user_metadata?.full_name ||
                  data.user.user_metadata?.name ||
                  (data.user.user_metadata?.given_name && data.user.user_metadata?.family_name ?
                    `${data.user.user_metadata.given_name} ${data.user.user_metadata.family_name}` : ''),
                avatar_url: data.user.user_metadata?.avatar_url ||
                  data.user.user_metadata?.picture ||
                  '',
                updated_at: new Date().toISOString()
              })
              .eq('id', data.user.id);

            if (updateError) {
              console.error('Error updating profile with admin client:', updateError)
              console.log('Falling back to regular syncUserProfile...')
              const result = await syncUserProfile(supabase, data.user);
              console.log('Profile sync result:', result)
            } else {
              console.log('Profile updated successfully with admin client')
            }
          } catch (updateCatchError: any) {
            console.error('Exception during profile update:', updateCatchError)
            console.error('Error stack:', updateCatchError.stack)

            // Fall back to regular sync
            console.log('Falling back to regular syncUserProfile after exception...')
            const result = await syncUserProfile(supabase, data.user);
            console.log('Profile sync result:', result)
          }
        }
      } catch (profileError: any) {
        console.error('Error in profile handling:', profileError)
        console.error('Error stack:', profileError.stack)
        // Continue even if profile sync fails - user will still be logged in
      }
    } catch (err: any) {
      console.error('Unexpected error in auth callback:', err)
      console.error('Error stack:', err.stack)
      return NextResponse.redirect(
        new URL(`${routes.auth.login}?error=unexpected_error&error_description=${err.message}`,
          requestUrl.origin)
      )
    }
  } else {
    console.error('No code provided in auth callback')
    return NextResponse.redirect(
      new URL(`${routes.auth.login}?error=no_code&error_description=No authorization code provided`,
        requestUrl.origin)
    )
  }

  console.log('=== AUTH CALLBACK COMPLETED SUCCESSFULLY ===')
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(routes.dashboard, requestUrl.origin))
}