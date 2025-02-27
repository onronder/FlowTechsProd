import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTheme } from "@/components/theme-provider"

export function DestinationsHeader() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">My Destinations</h1>
      <Button
        className={`
          ${isDarkMode
            ? 'bg-[#6366F1] hover:bg-[#818CF8] active:bg-[#4F46E5]'
            : 'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#1D4ED8]'
          }
          text-white border-none transition-colors duration-200
        `}
      >
        <Plus className="mr-2 h-4 w-4" /> Add New Destination
      </Button>
    </div>
  )
}

