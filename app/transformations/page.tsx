"use client"

import { useState } from 'react'
import { TransformationsHeader } from '@/components/transformations/transformations-header'
import { TransformationsList } from '@/components/transformations/transformations-list'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { useTheme } from '@/components/theme-provider'
import { AddTransformationModal } from '@/components/transformations/add-transformation-modal'

export default function TransformationsPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddNew = () => {
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <InfoTooltip
        message="⚠️ The Transformation page enables you to configure and apply data transformations, including derived columns and custom calculations, ensuring your data is optimized for your specific needs."
        pageIdentifier="transformations"
      />
      <TransformationsHeader onAddNew={handleAddNew} />
      <TransformationsList />
      <AddTransformationModal isOpen={isModalOpen} onClose={handleClose} />
    </div>
  )
}

