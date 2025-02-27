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

const metrics = [
  { name: "Product Sync", avgTime: "1.2s", success: "99.9%", volume: "50K" },
  { name: "Order Export", avgTime: "0.8s", success: "99.7%", volume: "10K" },
  { name: "Customer Data", avgTime: "1.5s", success: "99.5%", volume: "25K" },
]

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Job Type</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Type</TableHead>
              <TableHead>Avg. Time</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead>Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.name}>
                <TableCell className="font-medium">{metric.name}</TableCell>
                <TableCell>{metric.avgTime}</TableCell>
                <TableCell>{metric.success}</TableCell>
                <TableCell>{metric.volume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}