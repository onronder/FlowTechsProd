import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function SourcesHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">My Sources</h1>
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add New Source
      </Button>
    </div>
  )
}

