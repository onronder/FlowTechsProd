"use client"

import { AnalyticsHeader } from '@/components/analytics/analytics-header'
import { ETLReport } from '@/components/analytics/etl-report'
import { Graphs } from '@/components/analytics/graphs'
import { DataChart } from '@/components/analytics/data-chart'
import { useTheme } from 'next-themes'

export function AnalyticsContent() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <>
      <AnalyticsHeader />
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <ETLReport />
        <Graphs />
        <DataChart />
      </div>
    </>
  )
}

