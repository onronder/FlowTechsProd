"use client"

import Link from "next/link"
import { Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoutButton } from "@/components/auth/logout-button"
import { useUser } from "@/lib/context/user-context"
import { routes } from "@/lib/routes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function HeaderBar() {
  const { user, profile, isLoading } = useUser()

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return 'G'

    // Try to get name from profile first
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    // Then try user metadata
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    // Then try name in metadata
    if (user.user_metadata?.name) {
      return user.user_metadata.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    // Fallback to email
    return user.email?.charAt(0).toUpperCase() || 'U'
  }

  // Get the avatar URL
  const getAvatarUrl = () => {
    if (!user) return ''

    // Try profile first
    if (profile?.avatar_url) {
      return profile.avatar_url
    }

    // Then user metadata
    return user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      ''
  }

  // Get the display name
  const getDisplayName = () => {
    if (!user) return ''

    // Try profile first
    if (profile?.full_name) {
      return profile.full_name
    }

    // Then user metadata
    return user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email
  }

  return (
    <div className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-2 lg:gap-4 relative">
        <Input className="min-w-[280px] max-w-[320px] bg-muted" placeholder="Search..." />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>New integration available</DropdownMenuItem>
              <DropdownMenuItem>ETL job completed</DropdownMenuItem>
              <DropdownMenuItem>System update completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ThemeToggle />
        {!isLoading && (
          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={getAvatarUrl()} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {getDisplayName()}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={routes.settings}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={routes.settings}>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogoutButton variant="ghost" size="sm" showIcon={true} className="w-full justify-start px-0" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href={routes.auth.login}>Sign In</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

