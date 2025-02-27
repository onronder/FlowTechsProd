"use client"

import { PageHeader } from "@/components/ui/page-header"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { PerformanceMetrics } from "@/components/analytics/performance-metrics"
import { DataProcessingChart } from "@/components/analytics/data-processing-chart"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Monitor your data integration performance"
      />
      <AnalyticsOverview />
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <PerformanceMetrics />
        <DataProcessingChart />
      </div>
    </div>
  )
}

