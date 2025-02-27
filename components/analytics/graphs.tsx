"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"

const dataPullFrequency = [
  { time: "10:00", rows: 5000 },
  { time: "11:00", rows: 7500 },
  { time: "12:00", rows: 10345 },
  { time: "13:00", rows: 8000 },
  { time: "14:00", rows: 9500 },
]

const uploadSuccessRates = [
  { time: "10:00", rate: 95 },
  { time: "11:00", rate: 98 },
  { time: "12:00", rate: 85 },
  { time: "13:00", rate: 92 },
  { time: "14:00", rate: 97 },
]

export function Graphs() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Data Pull Frequency</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={dataPullFrequency}>
            <XAxis 
              dataKey="time" 
              stroke={isDark ? "#888888" : "#222222"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={isDark ? "#888888" : "#222222"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                borderColor: isDark ? '#374151' : '#E5E7EB',
                color: isDark ? '#F3F4F6' : '#111827'
              }}
            />
            <Line
              type="monotone"
              dataKey="rows"
              stroke={isDark ? "#60A5FA" : "#3B82F6"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Upload Success Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={uploadSuccessRates}>
            <XAxis 
              dataKey="time" 
              stroke={isDark ? "#888888" : "#222222"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={isDark ? "#888888" : "#222222"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                borderColor: isDark ? '#374151' : '#E5E7EB',
                color: isDark ? '#F3F4F6' : '#111827'
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke={isDark ? "#60A5FA" : "#22c55e"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

