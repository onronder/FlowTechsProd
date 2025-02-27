"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Trash2, ExternalLink, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface SourceCardProps {
  id: string
  name: string
  type: string
  status: "active" | "inactive"
  lastSync?: string
  credentials: any
  createdAt?: string
  onDelete?: () => void
  onRefresh?: () => void
}

export function SourceCard({
  id,
  name,
  type,
  status,
  lastSync,
  credentials,
  createdAt,
  onDelete,
  onRefresh
}: SourceCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [newName, setNewName] = useState(name)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()

  // Reduced console logging
  // Only log essential information for debugging

  // Update source name
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Source name cannot be empty.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('sources')
        .update({ name: newName })
        .eq('id', id)

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }

      toast({
        title: "Success",
        description: "Source updated successfully",
      })

      setIsEditModalOpen(false)

      // Trigger refresh after update
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error updating source:', error)
      toast({
        title: "Error",
        description: "Failed to update source. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Start Shopify reconnection process
  const handleReconnectShopify = () => {
    setIsConfirmModalOpen(false)
    setIsEditModalOpen(false)

    // Redirect to Shopify auth endpoint
    if (type.toLowerCase() === 'shopify') {
      // Extract shop from credentials
      const shopUrl = credentials?.shop
      if (shopUrl) {
        router.push(`/api/shopify/auth?shop=${shopUrl}`)
      } else {
        console.error('No shop URL found in credentials')
        toast({
          title: "Error",
          description: "Could not find shop URL. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false)
    if (onDelete) {
      onDelete()
    }
  }

  // Get store URL for display
  const getStoreUrl = () => {
    if (type.toLowerCase() === 'shopify' && credentials?.shop) {
      return `https://${credentials.shop}`
    }
    return null
  }

  const storeUrl = getStoreUrl()

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-md border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-800/50">
          <CardTitle className="text-sm font-medium truncate max-w-[70%]" title={name}>{name}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditModalOpen(true)}
              className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Edit source</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete source</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="text-sm font-medium capitalize">{type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={status === "active" ? "default" : "secondary"} className={`
                ${status === "active" ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300" : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"}
              `}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            {createdAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{createdAt}</span>
              </div>
            )}
            {storeUrl && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Store URL</span>
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  {credentials.shop.split('.')[0]}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
            {lastSync && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Sync</span>
                <span className="text-sm">{lastSync}</span>
              </div>
            )}
            {onRefresh && (
              <div className="mt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Source Settings</DialogTitle>
            <DialogDescription>
              Edit your connection details and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="breadcrumb" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateName} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reconnect Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reconnect Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to reconnect this store? This will refresh your connection.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="breadcrumb" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReconnectShopify}>
              Reconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this source and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}