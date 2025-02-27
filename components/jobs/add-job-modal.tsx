"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'

interface AddJobModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddJobModal({ isOpen, onClose }: AddJobModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    source: '',
    transformation: '',
    destination: '',
    schedule: {
      isRecurring: false,
      interval: '',
      option: '',
    },
  })
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    console.log('Submitting:', formData)
    // Here you would typically send the data to your backend
    onClose()
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
              To create a job, specify which Load & Transformation from a source should be sent to a destination. Finally, set whether the job will run once or on a recurring schedule.
            </p>
            <div className="space-y-2">
              <Label htmlFor="source">Select Source</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, source: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shopify">Shopify (E-Commerce)</SelectItem>
                  <SelectItem value="amazon">Amazon (Retail)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <Label>Select Transformation</Label>
            <RadioGroup onValueChange={(value) => setFormData({ ...formData, transformation: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transform1" id="transform1" />
                <Label htmlFor="transform1">Transformation 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transform2" id="transform2" />
                <Label htmlFor="transform2">Transformation 2</Label>
              </div>
            </RadioGroup>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <Label htmlFor="destination">Select Destination</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, destination: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google-drive">Google Drive</SelectItem>
                <SelectItem value="ftp">FTP/SFTP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.schedule.isRecurring}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, isRecurring: checked }
                })}
              />
              <Label htmlFor="recurring">Recurring Job</Label>
            </div>
            {formData.schedule.isRecurring ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="interval">Recurring Interval</Label>
                  <Select onValueChange={(value) => setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, interval: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option">Recurring Option</Label>
                  <Select onValueChange={(value) => setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, option: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.schedule.interval === 'daily' && (
                        Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))
                      )}
                      {formData.schedule.interval === 'weekly' && (
                        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
                        ))
                      )}
                      {formData.schedule.interval === 'monthly' && (
                        <>
                          {Array.from({ length: 31 }, (_, i) => (
                            <SelectItem key={i} value={(i + 1).toString()}>
                              {(i + 1).toString()}
                            </SelectItem>
                          ))}
                          <SelectItem value="last">Last day of each month</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
                This job will run once.
              </p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${isDarkMode ? 'bg-[#1E1E2D] text-white' : 'bg-white text-gray-900'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Job - Step {step} of 4
          </DialogTitle>
        </DialogHeader>
        {renderStepContent()}
        <DialogFooter>
          {step > 1 && (
            <Button onClick={handleBack} variant="outline" className={isDarkMode
              ? 'bg-[#374151] text-[#D1D5DB] hover:bg-[#4B5563] active:bg-[#1F2937]'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300'
            }>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext} className={isDarkMode
              ? 'bg-[#6366F1] text-white hover:bg-[#818CF8] active:bg-[#4F46E5]'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className={isDarkMode
              ? 'bg-[#6366F1] text-white hover:bg-[#818CF8] active:bg-[#4F46E5]'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }>
              Create Job
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

