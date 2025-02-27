"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "../../components/ui/bar-chart"
import { useTheme } from "@/components/theme-provider"

const chartData = {
  datasets: [
    {
      data: [180, 160, 150, 120, 90, 60, 45],
      backgroundColor: '#4C9AFF',
    },
  ],
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
}

export function ETLReport() {
  const { theme } = useTheme()

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent ETL Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Tracking daily ETL process performance across Shopify stores
        </p>
        <div className="h-80">
          <BarChart
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: theme === "dark" ? '#F3F4F6' : '#111827',
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    display: true,
                    color: theme === "dark" ? '#374151' : '#E5E7EB',
                  },
                  ticks: {
                    color: theme === "dark" ? '#F3F4F6' : '#111827',
                  }
                }
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

