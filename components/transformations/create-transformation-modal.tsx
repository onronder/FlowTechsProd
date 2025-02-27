"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const API_LIST = ['Order', 'Customer', 'Product', 'Inventory']

// Mock function to fetch fields for selected APIs
const fetchFields = async (apis: string[]) => {
  // In a real application, this would be an API call
  const mockFields = {
    Order: ['id', 'order_number', 'total_price', 'created_at'],
    Customer: ['id', 'first_name', 'last_name', 'email'],
    Product: ['id', 'title', 'price', 'inventory_quantity'],
    Inventory: ['product_id', 'warehouse_id', 'quantity', 'updated_at'],
  }
  
  return apis.reduce((acc, api) => {
    acc[api] = mockFields[api as keyof typeof mockFields] || []
    return acc
  }, {} as Record<string, string[]>)
}

export function CreateTransformationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    selectedApis: [] as string[],
    selectedFields: {} as Record<string, string[]>,
  })
  const [availableFields, setAvailableFields] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (step === 3 && formData.selectedApis.length > 0) {
      fetchFields(formData.selectedApis).then(setAvailableFields)
    }
  }, [step, formData.selectedApis])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleApiToggle = (api: string) => {
    setFormData(prev => ({
      ...prev,
      selectedApis: prev.selectedApis.includes(api)
        ? prev.selectedApis.filter(a => a !== api)
        : [...prev.selectedApis, api],
      selectedFields: prev.selectedApis.includes(api)
        ? { ...prev.selectedFields, [api]: [] }
        : { ...prev.selectedFields, [api]: prev.selectedFields[api] || [] }
    }))
  }

  const handleFieldToggle = (api: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFields: {
        ...prev.selectedFields,
        [api]: prev.selectedFields[api]?.includes(field)
          ? prev.selectedFields[api].filter(f => f !== field)
          : [...(prev.selectedFields[api] || []), field]
      }
    }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    console.log('Submitting:', formData)
    // Here you would typically send the data to your backend
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Transformation</DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4 py-4">
            <Label>Select APIs:</Label>
            {API_LIST.map((api) => (
              <div key={api} className="flex items-center space-x-2">
                <Checkbox
                  id={api}
                  checked={formData.selectedApis.includes(api)}
                  onCheckedChange={() => handleApiToggle(api)}
                />
                <Label htmlFor={api}>{api}</Label>
              </div>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-4 py-4">
            <Label>Select fields to include:</Label>
            {formData.selectedApis.map((api) => (
              <div key={api} className="mb-4">
                <h3 className="font-semibold mb-2">{api}</h3>
                {availableFields[api]?.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${api}-${field}`}
                      checked={formData.selectedFields[api]?.includes(field)}
                      onCheckedChange={() => handleFieldToggle(api, field)}
                    />
                    <Label htmlFor={`${api}-${field}`}>{field}</Label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <Button onClick={handleBack}>Back</Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Create Transformation</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

