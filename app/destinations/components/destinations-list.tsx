"use client"

import { useState } from "react"
import { DestinationCard } from "./destination-card"

const mockDestinations = [
  {
    name: "AWS S3 Bucket",
    type: "S3",
    status: "active" as const,
    lastSync: "2024-01-15 14:30"
  },
  {
    name: "Google Cloud Storage",
    type: "GCS",
    status: "active" as const,
    lastSync: "2024-01-15 13:45"
  },
  {
    name: "Azure Blob Storage",
    type: "Azure",
    status: "inactive" as const,
    lastSync: "2024-01-14 09:15"
  }
]

export function DestinationsList() {
  const [destinations] = useState(mockDestinations)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.name}
          {...destination}
          onEdit={() => console.log("Edit", destination.name)}
          onDelete={() => console.log("Delete", destination.name)}
        />
      ))}
    </div>
  )
}