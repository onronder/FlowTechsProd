import './globals.css'
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/lib/context/user-context"
import { ClientLayout } from '@/components/layout/client-layout'
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

// Script to handle ethereum property redefinition
const preventEthereumError = `
  (function() {
    try {
      // Check if ethereum is already defined
      if (typeof window !== 'undefined' && !window.ethereum) {
        // Create a non-configurable ethereum property to prevent extensions from redefining it
        Object.defineProperty(window, 'ethereum', {
          value: undefined,
          writable: true,
          configurable: false
        });
      }

      // Handle tronWeb sidechain deprecation warning
      if (typeof window !== 'undefined' && window.tronWeb && window.tronWeb.sidechain) {
        // Suppress the deprecation warning
        const originalSidechain = window.tronWeb.sidechain;
        Object.defineProperty(window.tronWeb, 'sidechain', {
          get: function() {
            return originalSidechain;
          },
          configurable: false
        });
      }
    } catch (e) {
      console.warn('Error in ethereum prevention script:', e);
    }
  })();
`;

export const metadata: Metadata = {
  title: "FlowTechs - Data Flow Automation",
  description: "Streamline your e-commerce data flow with powerful automations",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preventEthereumError }} />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <ClientLayout>{children}</ClientLayout>
          </UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}