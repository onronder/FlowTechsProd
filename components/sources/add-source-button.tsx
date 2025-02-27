import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useTheme } from "@/components/theme-provider"

interface AddSourceButtonProps {
  onClick: () => void;
}

export function AddSourceButton({ onClick }: AddSourceButtonProps) {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <Button 
      onClick={onClick}
      className={`
        ${isDarkMode
          ? 'bg-[#6366F1] hover:bg-[#818CF8] active:bg-[#4F46E5]'
          : 'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#1D4ED8]'
        }
        text-white border-none transition-colors duration-200
      `}
    >
      <Plus className="mr-2 h-4 w-4" /> Add New Source
    </Button>
  )
}

