"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { AddShopifySource } from "../components/add-shopify-source"

export default function AddSourcePage() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const router = useRouter()

  const handleBack = () => {
    if (selectedSource) {
      setSelectedSource(null)
    } else {
      router.push("/sources")
    }
  }

  // Render the selected source form
  const renderSourceForm = () => {
    switch (selectedSource) {
      case "shopify":
        return (
          <div>
            <AddShopifySource />
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
              >
                Back to Source Selection
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">
          {selectedSource
            ? `Add ${selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} Source`
            : "Add Data Source"}
        </h1>
      </div>

      {selectedSource ? (
        renderSourceForm()
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedSource("shopify")}
          >
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                <ShoppingBag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Shopify</CardTitle>
              <CardDescription>Connect your Shopify store</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Import products, orders, customers and more from your Shopify store.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Connect Shopify
              </Button>
            </CardFooter>
          </Card>

          {/* More source types can be added here */}
        </div>
      )}
    </div>
  )
}