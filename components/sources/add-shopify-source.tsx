"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { InfoIcon } from "lucide-react"
import { ShopifyIcon } from "../icons/shopify"

export function AddShopifySource() {
  const [shopDomain, setShopDomain] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Basic validation
    let domain = shopDomain.trim().toLowerCase()

    // Add .myshopify.com if not present
    if (!domain.includes('.myshopify.com')) {
      domain = `${domain}.myshopify.com`
    }

    // Ensure https:// is not included
    domain = domain.replace(/^https?:\/\//, '')

    // Validate domain format
    if (!domain.match(/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/)) {
      setError("Please enter a valid Shopify domain (example.myshopify.com)")
      setIsLoading(false)
      return
    }

    try {
      // Redirect to Shopify auth endpoint
      window.location.href = `/api/shopify/auth?shop=${domain}`
    } catch (err) {
      console.error("Error connecting to Shopify:", err)
      setError("Failed to connect to Shopify. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto border border-border bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Connect Shopify Store</CardTitle>
        <CardDescription>
          Connect your Shopify store to sync products, orders, and customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop-domain">Shopify Store URL</Label>
            <Input
              id="shop-domain"
              placeholder="your-store.myshopify.com"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="bg-muted border-border">
            <InfoIcon className="h-4 w-4 mr-2 text-foreground" />
            <AlertDescription>
              You'll be redirected to Shopify to authorize access to your store.
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !shopDomain.trim()}
          className="w-full"
        >
          {isLoading ? "Connecting..." : "Connect Store"}
        </Button>
      </CardFooter>
    </Card>
  )
}