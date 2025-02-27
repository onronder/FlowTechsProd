"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowUpRight, Clock, Database } from "lucide-react"

const metrics = [
  {
    title: "Total Jobs",
    value: "12",
    description: "Active data integration jobs",
    icon: Activity,
  },
  {
    title: "Sources",
    value: "8",
    description: "Connected data sources",
    icon: Database,
  },
  {
    title: "Processing Time",
    value: "1.2s",
    description: "Average processing time",
    icon: Clock,
  },
  {
    title: "Success Rate",
    value: "99.9%",
    description: "Job completion rate",
    icon: ArrowUpRight,
  },
]

export function MetricCards(): React.ReactElement {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric): any => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}