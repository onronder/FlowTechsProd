import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  const cookieStore = cookies()

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Sign out on the server
  await supabase.auth.signOut()

  // Clear all cookies related to authentication
  const response = NextResponse.redirect(new URL('/auth/login', request.url), {
    status: 302,
  })

  // Remove Supabase auth cookie
  response.cookies.delete('sb-wxoxpifuxmkakxnlkzql-auth-token')

  // Remove any additional cookies that might be related to auth
  response.cookies.delete('supabase-auth-token')

  return response
}

// Also support GET requests for direct linking
export async function GET(request: NextRequest) {
  return POST(request)
}