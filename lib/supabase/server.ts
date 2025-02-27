import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Keep track of whether we've already logged the client creation
let serverClientCreationLogged = false
let adminClientCreationLogged = false

export function createClient() {
  try {
    // Only log client creation once per session to reduce console spam
    if (!serverClientCreationLogged) {
      console.log('Creating Supabase server client')
      serverClientCreationLogged = true
    }

    const cookieStore = cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Only log environment variables once
    if (!serverClientCreationLogged) {
      console.log('Server client - Supabase URL:', supabaseUrl)
      console.log('Server client - Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...')
    }

    if (!supabaseUrl || supabaseUrl === 'undefined') {
      console.error('NEXT_PUBLIC_SUPABASE_URL is missing or undefined in server context')
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing in server context')
    }

    if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or undefined in server context')
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in server context')
    }

    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            try {
              const cookie = cookieStore.get(name)
              return cookie?.value
            } catch (error) {
              console.error(`Error retrieving cookie ${name}:`, error)
              return undefined
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle cookies in read-only context
              console.warn(`Unable to set cookie ${name} in read-only context:`, error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Handle cookies in read-only context
              console.warn(`Unable to remove cookie ${name} in read-only context:`, error)
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('Error creating Supabase server client:', error)
    throw error
  }
}

// For server-only routes that need full admin privileges
export function createAdminClient() {
  try {
    // Only log client creation once per session to reduce console spam
    if (!adminClientCreationLogged) {
      console.log('Creating Supabase admin client')
      adminClientCreationLogged = true
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

    // Only log environment variables once
    if (!adminClientCreationLogged) {
      console.log('Admin client - Supabase URL:', supabaseUrl)
      console.log('Admin client - Service Key (first 10 chars):', supabaseServiceKey.substring(0, 10) + '...')
    }

    if (!supabaseUrl || supabaseUrl === 'undefined') {
      console.error('NEXT_PUBLIC_SUPABASE_URL is missing or undefined in admin context')
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing in admin context')
    }

    if (!supabaseServiceKey || supabaseServiceKey === 'undefined') {
      console.error('SUPABASE_SERVICE_KEY is missing or undefined')
      throw new Error('SUPABASE_SERVICE_KEY is missing')
    }

    const cookieStore = cookies()

    return createServerClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        cookies: {
          get(name: string) {
            try {
              const cookie = cookieStore.get(name)
              return cookie?.value
            } catch (error) {
              console.error(`Admin client error retrieving cookie ${name}:`, error)
              return undefined
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            // For admin client, we don't actually need to set cookies
            // but the interface requires these methods
          },
          remove(name: string, options: CookieOptions) {
            // For admin client, we don't actually need to remove cookies
            // but the interface requires these methods
          },
        },
      }
    )
  } catch (error) {
    console.error('Error creating Supabase admin client:', error)
    throw error
  }
}