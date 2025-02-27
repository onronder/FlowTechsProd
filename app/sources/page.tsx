"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Plus,
  RefreshCw,
  Trash2,
  Settings,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Define the Source type
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
  updated_at?: string
  last_sync_at?: string
  user_id: string
}

// Helper function to force a full page refresh
const forceFullRefresh = () => {
  window.location.href = window.location.pathname;
};

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Fetch sources from Supabase
  const fetchSources = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      setDebugInfo(null)
      setNeedsRefresh(false)

      console.log("Creating Supabase client...")
      const supabase = createClient()

      console.log("Fetching sources from 'sources' table...")
      const { data, error, status, statusText } = await supabase
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false })

      // Store debug info
      setDebugInfo({
        status,
        statusText,
        errorMessage: error?.message,
        errorDetails: error?.details,
        dataLength: data?.length || 0,
        timestamp: new Date().toISOString()
      })

      if (error) {
        console.error("Error fetching sources:", error)
        setError(`Failed to load sources: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to load sources: ${error.message}`,
          variant: "destructive",
        })
        return
      }

      // Always set sources to an empty array if data is null or undefined
      // This ensures we properly handle the "no data" state
      setSources(data || [])

      if (!data || data.length === 0) {
        console.log("No sources found in database")
        // Don't set an error for empty data - it's a valid state
      } else {
        console.log(`Fetched ${data.length} sources:`, data)
      }

      if (isRefresh) {
        toast({
          title: "Success",
          description: data && data.length > 0
            ? `Sources refreshed successfully. Found ${data.length} sources.`
            : "Sources refreshed successfully. No sources found.",
        })
      }
    } catch (error: any) {
      console.error("Exception in fetchSources:", error)
      setError(`Exception: ${error.message || "Unknown error"}`)
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [toast])

  // Handle refresh button click
  const handleRefresh = () => {
    fetchSources(true)
  }

  // Delete a source
  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('sources')
        .delete()
        .eq('id', id)

      if (error) {
        console.error("Error deleting source:", error)
        toast({
          title: "Error",
          description: `Failed to delete source: ${error.message}`,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Source deleted successfully.",
      })

      // Refresh the sources list
      fetchSources()
    } catch (error: any) {
      console.error("Error in handleDelete:", error)
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Navigate to add source page
  const handleAddSource = () => {
    router.push("/sources/add")
  }

  // Connect to Shopify
  const handleConnectShopify = (shopUrl: string) => {
    if (!shopUrl) return

    // Redirect to Shopify auth endpoint
    router.push(`/api/shopify/auth?shop=${encodeURIComponent(shopUrl)}`)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Check for Shopify connection success
  useEffect(() => {
    const shopifyStatus = searchParams.get('shopify')

    // If we have a success parameter, check if we need to refresh
    if (shopifyStatus === 'success') {
      // Check for connection success cookie
      const hasSuccessCookie = document.cookie.includes('shopify_connection_success=true')

      if (hasSuccessCookie) {
        console.log("Shopify connection successful, refreshing sources...")
        fetchSources()

        // Clear the URL parameters to prevent showing the message on refresh
        if (window.history.replaceState) {
          const url = window.location.pathname
          window.history.replaceState({}, document.title, url)
        }
      }
    }
  }, [searchParams, fetchSources])

  // Load sources on component mount
  useEffect(() => {
    console.log("SourcesPage mounted, fetching sources...")
    fetchSources()

    // Check if we need to refresh after a delay (for cases where the data might not be immediately available)
    const connectionSuccess = document.cookie.includes('shopify_connection_success=true')

    if (connectionSuccess) {
      // Set a flag to show refresh prompt if needed
      const checkDataTimer = setTimeout(() => {
        // Only show refresh prompt if we have a connection success cookie but no sources
        if (sources.length === 0) {
          setNeedsRefresh(true)
        }
      }, 2000)

      return () => clearTimeout(checkDataTimer)
    }
  }, [fetchSources])

  // Render source cards in grid view
  const renderSourceCards = () => {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => (
          <Card key={source.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center">
              <CardTitle className="text-base font-medium truncate" title={source.name}>
                {source.name || `${source.source_type} Source`}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => router.push(`/sources/edit/${source.id}`)}
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500"
                  onClick={() => handleDelete(source.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className="text-sm font-medium capitalize">{source.source_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <Badge className={`${source.connection_status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                  {source.connection_status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Created</span>
                <span className="text-sm">{formatDate(source.created_at)}</span>
              </div>
              {source.source_type === 'shopify' && source.credentials?.shop && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Store</span>
                  <span className="text-sm">{source.credentials.shop}</span>
                </div>
              )}
              {source.connection_status !== 'active' && source.source_type === 'shopify' && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleConnectShopify(source.credentials?.shop || '')}
                  >
                    Reconnect
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Render sources in table view
  const renderSourceTable = () => {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableCaption>List of your data sources</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell className="capitalize">{source.source_type}</TableCell>
                  <TableCell>
                    <Badge className={`${source.connection_status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                      {source.connection_status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(source.created_at)}</TableCell>
                  <TableCell>
                    {source.source_type === 'shopify' && source.credentials?.shop && (
                      <span className="text-sm">{source.credentials.shop}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/sources/edit/${source.id}`)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {source.connection_status !== 'active' && source.source_type === 'shopify' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnectShopify(source.credentials?.shop || '')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Reconnect
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(source.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  // Render loading skeleton for grid view
  const renderLoadingSkeleton = () => {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-gray-800 px-4 py-3">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-8 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Render loading skeleton for table view
  const renderTableLoadingSkeleton = () => {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Data Sources</h1>
        <div className="flex gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={loading || refreshing}
            className="relative"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(loading || refreshing) ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={handleAddSource}>
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>
      </div>

      {needsRefresh && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <RefreshCw className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="flex justify-between items-center">
            <span className="text-blue-800 dark:text-blue-300">
              Your new source may not be visible yet. Click refresh to update the page.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="ml-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700"
            >
              Refresh Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <Alert className="mb-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDescription>
            <details>
              <summary className="cursor-pointer font-medium">Debug Information</summary>
              <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        viewMode === 'grid' ? renderLoadingSkeleton() : renderTableLoadingSkeleton()
      ) : sources.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No sources found</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Connect your first data source to get started with importing your data
              </p>
              <Button onClick={handleAddSource}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Source
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        viewMode === 'grid' ? renderSourceCards() : renderSourceTable()
      )}

      {sources.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 flex items-center">
          <div className="flex items-center mr-4">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
            <span>Active</span>
          </div>
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-gray-400 mr-1" />
            <span>Inactive</span>
          </div>
        </div>
      )}
    </div>
  )
}

