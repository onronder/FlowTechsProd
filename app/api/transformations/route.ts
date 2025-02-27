import { NextResponse } from 'next/server'

const transformations = [
  { id: 1, name: 'Order Data Cleanup', sourceId: 1, destinationId: 1, lastRun: '2023-11-22T10:30:00Z' },
  { id: 2, name: 'User Analytics Processing', sourceId: 2, destinationId: 2, lastRun: '2023-11-22T11:30:00Z' },
]

export async function GET() {
  return NextResponse.json(transformations)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newTransformation = {
    id: transformations.length + 1,
    ...body,
    lastRun: new Date().toISOString()
  }
  transformations.push(newTransformation)
  return NextResponse.json(newTransformation, { status: 201 })
}

