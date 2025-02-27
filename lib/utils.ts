import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAuthRoute(pathname: string): boolean {
  // Check for explicit auth-related paths
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/verification')
  ) {
    return true;
  }

  // For Next.js route groups, the actual URL doesn't contain the parentheses
  // but we need to handle that some auth pages might be in the (auth) group
  // We check specific auth pages that might be in that group
  const authPages = ['/login', '/register', '/forgot-password', '/verification', '/reset-password', '/signup'];
  return authPages.some(page => pathname === page);
}