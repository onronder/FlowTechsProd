import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Box, Edit } from 'lucide-react'
import { useTheme } from "@/components/theme-provider"

const sources = [
  { name: 'Shopify', icon: ShoppingCart, status: 'Active' },
  { name: 'Amazon', icon: Box, status: 'Active' },
]

export function SourcesList() {
  const { theme } = useTheme()
  const iconColor = theme === "dark" ? "text-white" : "text-black"

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sources.map((source, index) => (
        <Card key={index} className="transition-all duration-200 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10">
                  <source.icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{source.name}</h3>
                  <p className="text-sm text-green-500">{source.status}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Edit className={`mr-2 h-4 w-4 ${iconColor}`} /> Edit
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

