import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Implement actual data fetching logic
  const recentJobs = [
    { source: 'Shop', date: '2018/12/12', lastRun: '2023/11/22', lastDate: '2023/11/22' },
    { source: 'Orders', date: '2018/12/12', lastRun: '2023/11/22', lastDate: '2023/11/22' },
  ]

  return NextResponse.json(recentJobs)
}

