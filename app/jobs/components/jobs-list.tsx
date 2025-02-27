"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const jobs = [
  {
    id: "JOB-1234",
    name: "Daily Product Sync",
    source: "Shopify",
    destination: "FTP Server",
    status: "completed",
    lastRun: "2024-03-10 14:30:00",
  },
  {
    id: "JOB-1235",
    name: "Order Export",
    source: "Shopify",
    destination: "Amazon S3",
    status: "running",
    lastRun: "2024-03-10 14:15:00",
  },
  // Add more jobs...
]

export function JobsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Run</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.id}</TableCell>
                <TableCell>{job.name}</TableCell>
                <TableCell>{job.source}</TableCell>
                <TableCell>{job.destination}</TableCell>
                <TableCell>
                  <Badge
                    variant={job.status === "completed" ? "success" : "default"}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>{job.lastRun}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}