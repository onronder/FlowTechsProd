"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit } from 'lucide-react'

interface ConnectionCardProps {
  id: string;
  storeName: string;
  status: "connected" | "disconnected";
  url: string;
  onEdit?: (id: string) => void;
}

export function ConnectionCard({ id, storeName, status, url, onEdit }: ConnectionCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-bold">{storeName}</CardTitle>
        <Badge className={`
          ${status === "connected"
            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          }
        `}>
          {status === "connected" ? "Connected" : "Disconnected"}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{url}</p>
      </CardContent>
      <CardFooter className="pt-1">
        <Button onClick={() => onEdit?.(id)} variant="outline" size="sm" className="w-full">
          Edit Connection
        </Button>
      </CardFooter>
    </Card>
  )
}

