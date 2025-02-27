"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from 'next-themes'

interface AddDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (destination: any) => void;
  editingDestination: any;
}

export function AddDestinationModal({ isOpen, onClose, onSave, editingDestination }: AddDestinationModalProps) {
  const [name, setName] = useState(editingDestination?.name || '')
  const [type, setType] = useState(editingDestination?.type || '')
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const handleSave = () => {
    onSave({ name, type })
    setName('')
    setType('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${
        isDarkMode ? 'bg-[#1E1E2D] text-white border-[#333333]' : 'bg-white text-black border-[#E0E0E0]'
      }`}>
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-lg font-bold">
            {editingDestination ? "Edit Destination" : "Add New Destination"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={isDarkMode ? 'text-white' : 'text-black'}>Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${
                isDarkMode
                  ? 'bg-[#2C2C3B] text-white border-[#3A3A4B] focus:border-[#6366F1] placeholder-[#6C727C]'
                  : 'bg-white text-black border-[#E0E0E0] focus:border-[#1565C0] placeholder-[#BDBDBD]'
              }`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className={isDarkMode ? 'text-white' : 'text-black'}>Destination Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className={`${
                isDarkMode
                  ? 'bg-[#2C2C3B] text-white border-[#3A3A4B]'
                  : 'bg-white text-black border-[#E0E0E0]'
              }`}>
                <SelectValue placeholder="Select destination type" />
              </SelectTrigger>
              <SelectContent className={
                isDarkMode ? 'bg-[#2C2C3B] text-white border-[#3A3A4B]' : 'bg-white text-black border-[#E0E0E0]'
              }>
                <SelectItem value="FTP/SFTP">FTP/SFTP</SelectItem>
                <SelectItem value="Google Drive">Google Drive</SelectItem>
                <SelectItem value="Microsoft OneDrive">Microsoft OneDrive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="secondary" className={`
            ${isDarkMode 
              ? 'bg-[#2C2C3D] text-white hover:bg-[#3A3A4B]' 
              : 'bg-[#E0E0E0] text-black hover:bg-[#BDBDBD]'}
          `}>
            Cancel
          </Button>
          <Button onClick={handleSave} className={`
            ${isDarkMode
              ? 'bg-[#2196F3] text-white hover:bg-[#1E88E5]'
              : 'bg-[#1565C0] text-white hover:bg-[#0D47A1]'}
          `}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

