"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DestinationsList } from "./components/destinations-list"
import { AddDestinationModal } from "./components/add-destination-modal"

export default function DestinationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Destinations"
        description="Configure your data destinations"
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Destination
        </Button>
      </PageHeader>
      <DestinationsList />
      <AddDestinationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

