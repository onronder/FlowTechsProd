'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DevPage() {
  // Only show this page in development
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Not Available</AlertTitle>
          <AlertDescription>
            This page is only available in development mode.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Development Tools</CardTitle>
          <CardDescription>
            Helper tools for development and testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <AlertTitle>Development Only</AlertTitle>
            <AlertDescription>
              These tools are for development purposes only and should not be used in production.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/api/dev/bypass-auth" className="w-full">
            <Button className="w-full">
              Enable Auth Bypass (24 hours)
            </Button>
          </Link>
          <p className="text-xs text-gray-500 mt-2">
            Enabling auth bypass will allow you to access protected routes without authentication.
            This is useful for testing but should never be used in production.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}