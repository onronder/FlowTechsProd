"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Trash2 } from "lucide-react"

interface DestinationCardProps {
  name: string
  type: string
  status: "active" | "inactive"
  lastSync?: string
  onEdit?: () => void
  onDelete?: () => void
}

export function DestinationCard({
  name,
  type,
  status,
  lastSync,
  onEdit,
  onDelete
}: DestinationCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Edit destination</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete destination</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Type</span>
            <span className="text-sm font-medium">{type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`text-sm font-medium ${status === "active" ? "text-green-500" : "text-yellow-500"
              }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          {lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Sync</span>
              <span className="text-sm">{lastSync}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}