"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useTheme } from "@/components/theme-provider"
import { ExpressionEditor } from './expression-editor'

const API_LIST = ['Orders', 'Customers', 'Products', 'Inventory']

const mockFields = {
  Orders: ['id', 'order_number', 'total_price', 'created_at'],
  Customers: ['id', 'first_name', 'last_name', 'email'],
  Products: ['id', 'title', 'price', 'inventory_quantity'],
  Inventory: ['product_id', 'warehouse_id', 'quantity', 'updated_at'],
}

interface AddTransformationModalClientProps {
  isOpen: boolean
  onClose: () => void
}

// Client component wrapper that directly handles state and UI
export function AddTransformationModalClient({ isOpen, onClose }: AddTransformationModalClientProps) {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    dataSource: '',
    selectedApis: [] as string[],
    selectedFields: {} as Record<string, string[]>,
    derivedColumns: {} as Record<string, { name: string; expression: string }[]>,
  })

  // Move all the handler functions and state into this component directly
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, dataSource: value })
  }

  const handleApiToggle = (api: string) => {
    setFormData(prev => {
      const selectedApis = prev.selectedApis.includes(api)
        ? prev.selectedApis.filter(a => a !== api)
        : [...prev.selectedApis, api]

      // If we're removing an API, also remove its fields and derived columns
      if (!selectedApis.includes(api)) {
        const { [api]: _, ...restFields } = prev.selectedFields
        const { [api]: __, ...restDerivedColumns } = prev.derivedColumns

        return {
          ...prev,
          selectedApis,
          selectedFields: restFields,
          derivedColumns: restDerivedColumns
        }
      }

      return {
        ...prev,
        selectedApis
      }
    })
  }

  const handleFieldToggle = (api: string, field: string) => {
    setFormData(prev => {
      const apiFields = prev.selectedFields[api] || []
      const updatedFields = apiFields.includes(field)
        ? apiFields.filter(f => f !== field)
        : [...apiFields, field]

      return {
        ...prev,
        selectedFields: {
          ...prev.selectedFields,
          [api]: updatedFields
        }
      }
    })
  }

  const handleAddDerivedColumn = (api: string, name: string, expression: string) => {
    setFormData(prev => {
      const apiColumns = prev.derivedColumns[api] || []
      return {
        ...prev,
        derivedColumns: {
          ...prev.derivedColumns,
          [api]: [...apiColumns, { name, expression }]
        }
      }
    })
  }

  const handleDeleteDerivedColumn = (api: string, name: string) => {
    setFormData(prev => {
      const apiColumns = prev.derivedColumns[api] || []
      return {
        ...prev,
        derivedColumns: {
          ...prev.derivedColumns,
          [api]: apiColumns.filter(col => col.name !== name)
        }
      }
    })
  }

  const handleNext = () => {
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = () => {
    console.log('Submitting transformation:', formData)
    onClose()
  }

  const handleSkip = () => {
    handleNext()
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className={`text-right ${isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}`}>
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`col-span-3 ${isDarkMode
                  ? 'bg-[#2C2C3B] text-[#E4E7EB] border-[#3A3F4B] focus:border-[#6366F1] placeholder-[#6C727C]'
                  : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 placeholder-gray-400'
                  }`}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataSource" className={`text-right ${isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}`}>
                Data Source
              </Label>
              <Select onValueChange={handleSelectChange} value={formData.dataSource}>
                <SelectTrigger className={`col-span-3 ${isDarkMode
                  ? 'bg-[#2C2C3B] text-[#E4E7EB] border-[#3A3F4B]'
                  : 'bg-white text-gray-900 border-gray-300'
                  }`}>
                  <SelectValue placeholder="Select a data source" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-[#2C2C3B] text-[#E4E7EB] border-[#3A3F4B]' : 'bg-white text-gray-900 border-gray-300'}>
                  <SelectItem value="https://myshop.myshopify.com">My Shopify Store</SelectItem>
                  <SelectItem value="https://insights.myshopify.com">Shopify Insights</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="grid gap-4 py-4">
            <Label className={isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}>Select APIs:</Label>
            {API_LIST.map((api) => (
              <div key={api} className="flex items-center space-x-2">
                <Checkbox
                  id={api}
                  checked={formData.selectedApis.includes(api)}
                  onCheckedChange={() => handleApiToggle(api)}
                  className={isDarkMode ? 'border-[#3A3F4B]' : 'border-gray-300'}
                />
                <Label htmlFor={api} className={isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}>{api}</Label>
              </div>
            ))}
          </div>
        )
      case 3:
        return (
          <div className="grid gap-4 py-4">
            <Label className={isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}>Select fields to include:</Label>
            {formData.selectedApis.map((api) => (
              <div key={api} className="mb-4">
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}`}>{api}</h3>
                {mockFields[api as keyof typeof mockFields]?.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${api}-${field}`}
                      checked={formData.selectedFields[api]?.includes(field)}
                      onCheckedChange={() => handleFieldToggle(api, field)}
                      className={isDarkMode ? 'border-[#3A3F4B]' : 'border-gray-300'}
                    />
                    <Label htmlFor={`${api}-${field}`} className={isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}>{field}</Label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      case 4:
        return (
          <ExpressionEditor
            selectedApis={formData.selectedApis}
            selectedFields={formData.selectedFields}
            onAddDerivedColumn={handleAddDerivedColumn}
            onDeleteDerivedColumn={handleDeleteDerivedColumn}
            derivedColumns={formData.derivedColumns}
            isDarkMode={isDarkMode}
            onSkip={handleSkip}
          />
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Create New Transformation</DialogTitle>
        </DialogHeader>

        {renderStepContent()}

        <DialogFooter className="flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <div className="flex space-x-2">
            {step < 3 && (
              <Button type="button" variant="outline" onClick={handleSkip}>
                Skip
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit}>
                Save Transformation
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}