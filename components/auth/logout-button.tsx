'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  className?: string
}

export function LogoutButton({
  variant = 'ghost',
  size = 'sm',
  showIcon = true,
  className
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)

  // Simple function that just sets loading state
  function handleClick() {
    setLoading(true);
  }

  return (
    // Use an anchor tag instead of a button for more reliable behavior
    <a href="/api/auth/logout" onClick={handleClick}>
      <Button
        variant={variant}
        size={size}
        disabled={loading}
        className={className}
        type="button" // Not a submit button
      >
        {showIcon && <LogOut className="mr-2 h-4 w-4" />}
        {loading ? 'Signing out...' : 'Sign out'}
      </Button>
    </a>
  )
}