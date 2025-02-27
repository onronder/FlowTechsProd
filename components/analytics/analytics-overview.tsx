"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Activity, Clock } from "lucide-react"

const metrics = [
  {
    title: "Total Processed",
    value: "1.2M",
    change: "+12.3%",
    trend: "up",
    icon: Activity,
  },
  {
    title: "Average Time",
    value: "1.5s",
    change: "-5.2%",
    trend: "down",
    icon: Clock,
  },
  {
    title: "Success Rate",
    value: "99.9%",
    change: "+0.5%",
    trend: "up",
    icon: ArrowUpRight,
  },
  {
    title: "Error Rate",
    value: "0.1%",
    change: "-0.3%",
    trend: "down",
    icon: ArrowDownRight,
  },
]

export function AnalyticsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {metric.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}