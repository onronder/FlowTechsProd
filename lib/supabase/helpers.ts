import { SupabaseClient, User } from '@supabase/supabase-js'

/**
 * Creates or updates a user profile in the Supabase profiles table
 * This ensures user metadata from providers like Google is properly saved
 */
export async function syncUserProfile(supabase: SupabaseClient, user: User) {
  try {
    if (!user) {
      console.error('syncUserProfile called with null user')
      return { success: false, error: 'No user provided' }
    }

    console.log('Syncing user profile for:', user.id)
    console.log('User metadata:', JSON.stringify(user.user_metadata))

    // Extract relevant user data with fallbacks for Google Auth
    const userData = {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        (user.user_metadata?.given_name && user.user_metadata?.family_name ?
          `${user.user_metadata.given_name} ${user.user_metadata.family_name}` : ''),
      avatar_url: user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        '',
      updated_at: new Date().toISOString(),
    }

    console.log('Processed user data:', JSON.stringify(userData))

    // Update the profile in the profiles table
    const { error } = await supabase
      .from('profiles')
      .upsert(userData, { onConflict: 'id' })

    if (error) {
      console.error('Error syncing user profile:', error)
      return { success: false, error }
    }

    console.log('User profile synced successfully')
    return { success: true }
  } catch (error) {
    console.error('Error in syncUserProfile:', error)
    return { success: false, error }
  }
}

/**
 * Retrieves the user profile data from the profiles table
 */
export async function getUserProfile(supabase: SupabaseClient, userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}