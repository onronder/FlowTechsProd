"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: {
    id?: number;
    storeName: string;
    url: string;
    apiKey: string;
    apiSecret: string;
    status: "Active" | "Inactive";
  } | null;
}

export function ConnectionModal({ isOpen, onClose, onSave, initialData }: ConnectionModalProps) {
  const [open, setOpen] = useState(isOpen)
  const [url, setUrl] = useState(initialData?.url || "")
  const [apiKey, setApiKey] = useState(initialData?.apiKey || "")
  const [apiSecret, setApiSecret] = useState(initialData?.apiSecret || "")
  const [storeName, setStoreName] = useState(initialData?.storeName || "")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    setOpen(isOpen)
    if (isOpen && initialData) {
      setUrl(initialData.url)
      setApiKey(initialData.apiKey)
      setApiSecret(initialData.apiSecret)
      setStoreName(initialData.storeName)
    } else {
      setUrl("")
      setApiKey("")
      setApiSecret("")
      setStoreName("")
    }
  }, [isOpen, initialData])

  const handleSave = () => {
    onSave({ storeName, url, apiKey, apiSecret, status: initialData?.status || "Active" })
    handleClose()
  }

  const handleClose = () => {
    if (hasChanges()) {
      setShowConfirmDialog(true)
    } else {
      setOpen(false)
      onClose()
    }
  }

  const confirmClose = () => {
    setShowConfirmDialog(false)
    setOpen(false)
    onClose()
  }

  const hasChanges = () => {
    return (
      url !== (initialData?.url || "") ||
      apiKey !== (initialData?.apiKey || "") ||
      apiSecret !== (initialData?.apiSecret || "") ||
      storeName !== (initialData?.storeName || "")
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="bg-[#1E1E2F] text-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{initialData ? "Edit Connection" : "Add New Connection"}</DialogTitle>
            <DialogDescription className="text-[#AAB2BF]">
              {initialData ? "Modify your connection details below." : "Enter your connection details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="storeName" className="text-right text-[#AAB2BF]">
                Store Name
              </Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Your Store Name"
                className="col-span-3 bg-[#2C2C3B] text-[#E4E7EB] border-[#3A3F4B] focus:border-[#6366F1] placeholder-[#6C727C]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right text-[#AAB2BF]">
                Store URL
              </Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-store.myshopify.com"
                className="col-span-3 bg-[#2C2C3B] text-[#E4E7EB] border-[#3A3F4B] focus:border-[#6366F1] placeholder-[#6C727C]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right text-[#AAB2BF]">
                API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your API Key"
                className="col-span-3 bg-[#2C2C3B] text-[#E4E7EB] border-[#3A3F4B] focus:border-[#6366F1] placeholder-[#6C727C]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiSecret" className="text-right text-[#AAB2BF]">
                API Secret
              </Label>
              <Input
                id="apiSecret"
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Your API Secret"
                className="col-span-3 bg-[#2C2C3B] text-[#E4E7EB] border-[#3A3F4B] focus:border-[#6366F1] placeholder-[#6C727C]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSave} 
              className="bg-[#6366F1] text-white hover:bg-[#818CF8] active:bg-[#4F46E5]"
            >
              Save
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="bg-[#374151] text-[#D1D5DB] hover:bg-[#4B5563] active:bg-[#1F2937]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-[#1E1E2F] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription className="text-[#AAB2BF]">
              You have unsaved changes. Are you sure you want to close without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)} className="bg-[#374151] text-[#D1D5DB] hover:bg-[#4B5563] active:bg-[#1F2937]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose} className="bg-[#374151] text-[#D1D5DB] hover:bg-[#4B5563] active:bg-[#1F2937]">
              Don't Save
            </AlertDialogAction>
            <Button onClick={handleSave} className="bg-[#6366F1] text-white hover:bg-[#818CF8] active:bg-[#4F46E5]">
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

