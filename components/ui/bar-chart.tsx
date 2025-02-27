"use client"

import { useRef, useEffect } from "react"
import { Chart, ChartData, ChartOptions, registerables } from "chart.js"

Chart.register(...registerables)

interface BarChartProps {
  data: ChartData
  options?: ChartOptions
  width?: number
  height?: number
}

export function BarChart({ data, options, width, height }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Destroy previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    // Create new chart
    const ctx = canvasRef.current.getContext("2d")
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: "bar",
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options,
        },
      })
    }

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, options])

  return <canvas ref={canvasRef} width={width} height={height} />
}