'use client'

import { usePathname } from 'next/navigation'
import { ExpandedSidebar } from '@/components/expanded-sidebar'
import { HeaderBar } from '@/components/header-bar'
import { PageTooltip } from '@/components/ui/page-tooltip'
import ErrorBoundary from '@/components/error-boundary'
import { cn } from "@/lib/utils"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // Get the current path using the hook
  const pathname = usePathname() || '';

  // Check if current route is an auth route
  const isAuth =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/verification');

  return (
    <div className="flex min-h-screen">
      {!isAuth && <ExpandedSidebar />}
      <div className="flex-1">
        {!isAuth && (
          <div className="fixed top-0 right-0 left-72 z-10 border-b bg-background">
            <HeaderBar />
          </div>
        )}
        <main className={cn(
          "relative",
          isAuth ? "" : "ml-72 mt-14 p-8"
        )}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        {!isAuth && <PageTooltip />}
      </div>
    </div>
  );
}