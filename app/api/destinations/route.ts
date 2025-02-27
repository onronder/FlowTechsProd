import { NextResponse } from 'next/server'

const destinations = [
  { id: 1, name: 'Data Warehouse', type: 'database', lastUpdate: '2023-11-22T12:00:00Z' },
  { id: 2, name: 'Business Intelligence Tool', type: 'api', lastUpdate: '2023-11-22T13:00:00Z' },
]

export async function GET() {
  return NextResponse.json(destinations)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newDestination = {
    id: destinations.length + 1,
    ...body,
    lastUpdate: new Date().toISOString()
  }
  destinations.push(newDestination)
  return NextResponse.json(newDestination, { status: 201 })
}

