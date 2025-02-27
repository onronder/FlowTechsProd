"use client"

import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from "@/components/theme-provider"

interface InfoTooltipProps {
  message: string
  pageIdentifier: string
}

export function InfoTooltip({ message, pageIdentifier }: InfoTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  useEffect(() => {
    const hideTooltip = localStorage.getItem(`hideTooltip-${pageIdentifier}`)
    setShowTooltip(hideTooltip !== 'true')
  }, [pageIdentifier])

  const dismissTooltip = () => {
    localStorage.setItem(`hideTooltip-${pageIdentifier}`, 'true')
    setShowTooltip(false)
  }

  if (!showTooltip) return null

  return (
    <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
      isDarkMode ? 'bg-[#1E3A8A]' : 'bg-[#E3F2FD]'
    }`}>
      <AlertCircle className={`w-4 h-4 mt-1 ${isDarkMode ? 'text-[#BBE1FA]' : 'text-[#1565C0]'}`} />
      <div className="flex-grow">
        <p className={`text-sm mb-2 ${isDarkMode ? 'text-[#BBE1FA]' : 'text-[#1565C0]'}`}>{message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={dismissTooltip}
          className={`mt-2 ${
            isDarkMode
              ? 'bg-[#2C2C3D] text-white hover:bg-[#3A3A4B]'
              : 'bg-[#E0E0E0] text-black hover:bg-[#BDBDBD]'
          }`}
        >
          Don't Show This Message Again
        </Button>
      </div>
    </div>
  )
}

