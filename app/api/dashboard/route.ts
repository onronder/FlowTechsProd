import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // In a real application, you would fetch this data from a database
    const dashboardData = {
      totalUsers: 10234,
      eventCount: 536,
      conversations: 21,
      newUsers: 3321,
      recentJobs: [
        {
          source: 'Orders',
          date: '2018/12/12',
          lastRun: '2023/11/22',
          lastDate: '2023/11/22'
        }
      ],
      dataSizeByMonth: [
        { name: "Jan", total: 3000 },
        { name: "Feb", total: 3500 },
        { name: "Mar", total: 4000 },
        { name: "Apr", total: 3800 },
        { name: "May", total: 4200 },
        { name: "Jun", total: 4500 },
        { name: "Jul", total: 4800 },
        { name: "Aug", total: 5000 },
        { name: "Sep", total: 5200 },
        { name: "Oct", total: 5500 },
        { name: "Nov", total: 5800 },
        { name: "Dec", total: 6000 },
      ]
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error in dashboard API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

