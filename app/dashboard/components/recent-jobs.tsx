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

const recentJobs = [
  {
    id: "JOB-1234",
    name: "Daily Product Sync",
    status: "completed",
    duration: "2m 30s",
    timestamp: "2024-03-10 14:30:00",
  },
  {
    id: "JOB-1235",
    name: "Order Export",
    status: "running",
    duration: "1m 15s",
    timestamp: "2024-03-10 14:15:00",
  },
  // Add more jobs...
]

export function RecentJobs(): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentJobs.map((job): any => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={job.status === "completed" ? "success" : "default"}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>{job.duration}</TableCell>
                <TableCell>{job.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}