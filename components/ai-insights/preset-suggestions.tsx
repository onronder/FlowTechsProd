"use client"

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

const suggestions = [
  "Write a to-do list for a personal project or task.",
  "Generate an email to reply to a job offer.",
  "Summarize this article or text for me in one paragraph.",
  "Find correlations in my Shopify data.",
]

export function PresetSuggestions() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className={`text-sm font-normal transition-all ${
            isDarkMode
              ? 'bg-[#2C2C3D] text-white border-[#3A3A4B] hover:bg-[#3A3A4B] hover:shadow-[0_0_5px_rgba(255,255,255,0.1)]'
              : 'bg-white text-black border-[#E0E0E0] hover:bg-gray-100 hover:shadow-[0_0_5px_rgba(0,0,0,0.1)]'
          }`}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}

