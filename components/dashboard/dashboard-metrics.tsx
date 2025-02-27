"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const metrics = [
  {
    title: "Total Data Processed",
    value: "2.4 TB",
    chart: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        data: [300, 350, 200, 400, 450],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      }]
    }
  },
  {
    title: "Active Sources",
    value: "24",
    chart: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        data: [20, 22, 21, 24, 24],
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      }]
    }
  },
  {
    title: "Success Rate",
    value: "99.9%",
    chart: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        data: [99.8, 99.9, 99.7, 99.9, 99.9],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      }]
    }
  }
]

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  maintainAspectRatio: false,
}

export function DashboardMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="h-[80px]">
              <Line
                data={{
                  ...metric.chart,
                  datasets: metric.chart.datasets.map(dataset => ({
                    ...dataset,
                    fill: false,
                  }))
                }}
                options={chartOptions}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

