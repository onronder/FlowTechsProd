import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Cloud, Database, FileText, HardDrive, Server } from 'lucide-react'
import { useTheme } from "@/components/theme-provider"

const destinations = [
  { name: 'Acquia', icon: Cloud, status: 'Connected' },
  { name: 'Google Drive', icon: FileText, status: 'Connected' },
  { name: 'OneDrive', icon: FileText, status: 'Not Connected' },
  { name: 'Custom FTP/SFTP', icon: Server, status: 'Not Connected' },
  { name: 'Azure SQL DB', icon: Database, status: 'Not Connected' },
  { name: 'Amazon S3', icon: HardDrive, status: 'Not Connected' },
]

export function DestinationsList() {
  const { theme } = useTheme()
  const iconColor = theme === "dark" ? "text-white" : "text-black"

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination, index) => (
        <Card key={index} className="transition-all duration-200 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10">
                  <destination.icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{destination.name}</h3>
                  <p className={`text-sm ${destination.status === 'Connected' ? 'text-green-500' : 'text-gray-500'}`}>
                    {destination.status}
                  </p>
                </div>
              </div>
            </div>
            <Button 
              variant={destination.status === 'Connected' ? 'outline' : 'default'} 
              size="sm"
              className="w-full"
            >
              {destination.status === 'Connected' ? 'Disconnect' : 'Connect'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

