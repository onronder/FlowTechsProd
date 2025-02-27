"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const SHOPIFY_APIS = [
  { id: 'customers', label: 'Customers' },
  { id: 'orders', label: 'Orders' },
  { id: 'products', label: 'Products' },
  { id: 'inventory', label: 'Inventory' },
]

export function AddSourceModal({ isOpen, onClose, editingSource }: { isOpen: boolean; onClose: () => void; editingSource: string | null }): React.ReactElement {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    secretKey: '',
    storeName: '',
    connectionName: '',
    selectedApis: [] as string[],
  })

  useEffect((): void => {
    if (editingSource) {
      // Here you would typically fetch the existing data for the source being edited
      // For now, we'll just set some dummy data
      setFormData({
        secretKey: 'existing-secret-key',
        storeName: editingSource,
        connectionName: `${editingSource} Connection`,
        selectedApis: ['customers', 'orders'],
      })
    } else {
      // Reset form when adding a new source
      setFormData({
        secretKey: '',
        storeName: '',
        connectionName: '',
        selectedApis: [],
      })
    }
    setStep(1)
  }, [editingSource])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleApiToggle = (apiId: string): void => {
    setFormData((prev: any) => ({
      ...prev,
      selectedApis: prev.selectedApis.includes(apiId)
        ? prev.selectedApis.filter((id: any) => id !== apiId)
        : [...prev.selectedApis, apiId]
    }))
  }

  const handleNext = (): void => {
    if (step < 2) setStep(step + 1)
  }

  const handleBack = (): void => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (): void => {
    console.log('Submitting:', formData)
    // Here you would typically send the data to your backend
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingSource ? `Edit ${editingSource} Source` : 'Add New Shopify Source'}</DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secretKey" className="text-right">
                Secret Key
              </Label>
              <Input
                id="secretKey"
                name="secretKey"
                value={formData.secretKey}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="storeName" className="text-right">
                Store Name
              </Label>
              <Input
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="connectionName" className="text-right">
                Connection Name
              </Label>
              <Input
                id="connectionName"
                name="connectionName"
                value={formData.connectionName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4 py-4">
            <Label>Select APIs to use:</Label>
            {SHOPIFY_APIS.map((api): any => (
              <div key={api.id} className="flex items-center space-x-2">
                <Checkbox
                  id={api.id}
                  checked={formData.selectedApis.includes(api.id)}
                  onCheckedChange={(): any => handleApiToggle(api.id)}
                />
                <Label htmlFor={api.id}>{api.label}</Label>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <Button onClick={handleBack}>Back</Button>
          )}
          {step < 2 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>{editingSource ? 'Update' : 'Submit'}</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

