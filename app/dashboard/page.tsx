import { MetricCards } from "@/components/dashboard/metric-cards"
import { DataChart } from "./components/data-chart"
import { RecentJobs } from "./components/recent-jobs"
import { PageHeader } from "@/components/ui/page-header"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your data integration activities"
      />
      <MetricCards />
      <div className="grid gap-6 grid-cols-1">
        <DataChart />
        <RecentJobs />
      </div>
    </div>
  )
}

