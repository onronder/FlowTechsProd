"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"

const data = [
  { name: "Jan", total: 2400 },
  { name: "Feb", total: 1398 },
  { name: "Mar", total: 9800 },
  { name: "Apr", total: 3908 },
  { name: "May", total: 4800 },
  { name: "Jun", total: 3800 },
]

export function DataChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Card className={`w-full ${
      isDark 
        ? 'bg-[#2C2C3D] border-[#333333]' 
        : 'bg-white border-[#E0E0E0]'
    }`}>
      <CardHeader>
        <CardTitle>Data Size</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="name"
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
              tickFormatter={(value) => `${value} MB`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                borderColor: isDark ? '#374151' : '#E5E7EB',
                color: isDark ? '#F3F4F6' : '#111827'
              }}
            />
            <Bar
              dataKey="total"
              fill={isDark ? "#60A5FA" : "#3B82F6"}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

