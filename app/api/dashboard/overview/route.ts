import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Implement actual data fetching logic
  const overviewData = {
    lastTransferredOrderCount: 147,
    lastTransferredCustomerCount: 52,
    totalUploadTime: '00:04:53',
  }

  return NextResponse.json(overviewData)
}

