"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Source {
  id: string
  name: string
  source_type: string
  connection_status: string
  credentials: {
    shop?: string
    [key: string]: any
  }
  created_at: string
}

export default function EditSourcePage({ params }: { params: { id: string } }) {
  const [source, setSource] = useState<Source | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Fetch source data
  useEffect(() => {
    const fetchSource = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        const { data, error } = await supabase
          .from('sources')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) {
          console.error("Error fetching source:", error)
          toast({
            title: "Error",
            description: "Failed to load source data. Please try again.",
            variant: "destructive",
          })
          return
        }

        setSource(data)
        setName(data.name || "")
      } catch (error) {
        console.error("Error in fetchSource:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSource()
  }, [params.id, toast])

  // Save source changes
  const handleSave = async () => {
    if (!source) return

    try {
      setSaving(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('sources')
        .update({ name })
        .eq('id', source.id)

      if (error) {
        console.error("Error updating source:", error)
        toast({
          title: "Error",
          description: "Failed to update source. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Source updated successfully.",
      })

      // Navigate back to sources page
      router.push("/sources")
    } catch (error) {
      console.error("Error in handleSave:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Connect to Shopify
  const handleConnectShopify = () => {
    if (!source || source.source_type !== 'shopify' || !source.credentials?.shop) return

    // Redirect to Shopify auth endpoint
    router.push(`/api/shopify/auth?shop=${encodeURIComponent(source.credentials.shop)}`)
  }

  // Handle back button
  const handleBack = () => {
    router.push("/sources")
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold">Edit Source</h1>
        </div>
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading source data...</p>
        </div>
      </div>
    )
  }

  if (!source) {
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
          <h1 className="text-3xl font-bold">Edit Source</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-red-500">Source not found or has been deleted.</p>
              <Button
                onClick={handleBack}
                className="mt-4"
              >
                Return to Sources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
        <h1 className="text-3xl font-bold">Edit Source</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit {source.source_type.charAt(0).toUpperCase() + source.source_type.slice(1)} Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Source Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter source name"
              />
            </div>

            {source.source_type === 'shopify' && (
              <div className="space-y-2">
                <Label>Shopify Store</Label>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <span>{source.credentials?.shop || 'Unknown store'}</span>
                  {source.connection_status !== 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleConnectShopify}
                    >
                      Reconnect
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}