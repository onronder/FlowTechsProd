import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Development bypass for testing - remove in production
  const isDev = process.env.NODE_ENV === 'development';
  const bypassAuth = isDev && request.cookies.get('bypassAuth')?.value === 'true';

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // This is a fix for the Next.js Edge Runtime
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // This is a fix for the Next.js Edge Runtime
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/sources', '/transformations', '/destinations']

  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

  // Skip auth check if bypass is enabled (development only)
  if (bypassAuth) {
    console.log('Auth bypass enabled for development');
    return response;
  }

  // Redirect to login if trying to access protected route without session
  if (isProtectedRoute && !data.session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect to dashboard if user is already logged in and tries to access auth routes
  if (isAuthRoute && data.session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// Only run middleware on the following paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

