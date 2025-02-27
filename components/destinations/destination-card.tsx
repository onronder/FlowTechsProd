"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DestinationCardProps {
  destination: {
    id: number;
    name: string;
    type: string;
    isConnected: boolean;
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggleConnection: () => void;
  isDarkMode: boolean;
}

export function DestinationCard({ destination, onEdit, onDelete, onToggleConnection, isDarkMode }: DestinationCardProps) {
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)

  const handleToggle = () => {
    if (destination.isConnected) {
      setShowDisconnectDialog(true)
    } else {
      onToggleConnection()
    }
  }

  return (
    <>
      <Card className={`transition-all duration-200 ${
        isDarkMode 
          ? 'bg-[#2C2C3D] border-[#333333] hover:shadow-[inset_0_0_6px_rgba(58,58,75,0.2)]' 
          : 'bg-white border-[#E0E0E0] hover:shadow-[0_0_8px_rgba(0,0,0,0.1)]'
      }`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {destination.name}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-[#A6A6A6]' : 'text-[#4A4A4A]'}`}>
                {destination.type}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Switch
                checked={destination.isConnected}
                onCheckedChange={handleToggle}
              />
              <span className={`text-sm ${destination.isConnected ? 'text-[#34C759]' : 'text-[#D1D1D6]'}`}>
                {destination.isConnected ? 'Connected' : 'Disconnected'}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className={`h-5 w-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent className={`${
          isDarkMode ? 'bg-[#1E1E2D] text-white border-[#333333]' : 'bg-white text-black border-[#E0E0E0]'
        }`}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              Disconnect Destination
            </AlertDialogTitle>
            <AlertDialogDescription className={
              isDarkMode ? 'text-[#A6A6A6]' : 'text-[#4A4A4A]'
            }>
              Are you sure you want to close an open and active connection?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={`
              ${isDarkMode 
                ? 'bg-[#2C2C3D] text-white hover:bg-[#3A3A4B]' 
                : 'bg-[#E0E0E0] text-black hover:bg-[#BDBDBD]'}
            `}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onToggleConnection()
                setShowDisconnectDialog(false)
              }}
              className={`
                ${isDarkMode
                  ? 'bg-[#2196F3] text-white hover:bg-[#1E88E5]'
                  : 'bg-[#1565C0] text-white hover:bg-[#0D47A1]'}
              `}
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

