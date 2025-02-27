"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { JobsList } from "./components/jobs-list"
import { AddJobModal } from "./components/add-job-modal"

export default function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Manage your data integration jobs"
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Job
        </Button>
      </PageHeader>
      <JobsList />
      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

