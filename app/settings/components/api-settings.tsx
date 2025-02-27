"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw } from "lucide-react"

const apiKeys = [
  {
    name: "Production API Key",
    key: "sk_prod_**********************",
    created: "2024-01-15",
  },
  {
    name: "Development API Key",
    key: "sk_dev_**********************",
    created: "2024-02-01",
  },
]

export function ApiSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Manage your API keys for external integrations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.name} className="space-y-2">
            <Label>{apiKey.name}</Label>
            <div className="flex space-x-2">
              <Input
                readOnly
                value={apiKey.key}
                className="font-mono"
              />
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy API key</span>
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Regenerate API key</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Created on {apiKey.created}
            </p>
          </div>
        ))}
        <div className="flex justify-end">
          <Button>Generate New API Key</Button>
        </div>
      </CardContent>
    </Card>
  )
}