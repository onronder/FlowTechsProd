import { NextResponse } from 'next/server'

const sources = [
  { id: 1, name: 'Shopify', type: 'ecommerce', lastSync: '2023-11-22T10:00:00Z' },
  { id: 2, name: 'Google Analytics', type: 'analytics', lastSync: '2023-11-22T11:00:00Z' },
]

export async function GET() {
  return NextResponse.json(sources)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newSource = {
    id: sources.length + 1,
    ...body,
    lastSync: new Date().toISOString()
  }
  sources.push(newSource)
  return NextResponse.json(newSource, { status: 201 })
}

