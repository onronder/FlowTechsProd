import { createBrowserClient } from '@supabase/ssr'

// Keep track of whether we've already logged the client creation
let clientCreationLogged = false

export function createClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Only log client creation once per session to reduce console spam
    if (!clientCreationLogged) {
      console.log('Creating Supabase browser client')
      console.log('Supabase URL:', supabaseUrl)
      console.log('Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...')
      clientCreationLogged = true
    }

    if (!supabaseUrl || supabaseUrl === 'undefined') {
      console.error('NEXT_PUBLIC_SUPABASE_URL is missing or undefined')
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing')
    }

    if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or undefined')
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
    }

    const client = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey
    )

    return client
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    throw error
  }
}