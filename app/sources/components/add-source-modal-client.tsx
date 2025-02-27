"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddShopifySource } from "./add-shopify-source"

// Client component interface
interface AddSourceModalClientProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

// Client component implementation
export function AddSourceModalClient({ isOpen, onOpenChange }: AddSourceModalClientProps) {
  const [sourceType, setSourceType] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add source logic here
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Source</DialogTitle>
          <DialogDescription>
            Connect a new data source to import your data.
          </DialogDescription>
        </DialogHeader>

        {sourceType === "shopify" ? (
          <div className="py-4">
            <AddShopifySource />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="source-type">Source Type</Label>
                <Select
                  value={sourceType}
                  onValueChange={setSourceType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shopify">Shopify</SelectItem>
                    <SelectItem value="woocommerce">WooCommerce</SelectItem>
                    <SelectItem value="bigcommerce">BigCommerce</SelectItem>
                    <SelectItem value="custom">Custom API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sourceType === "custom" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Source Name</Label>
                    <Input id="name" placeholder="My Custom API" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="api-url">API URL</Label>
                    <Input id="api-url" placeholder="https://api.example.com" />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!sourceType}>
                Continue
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}