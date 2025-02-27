import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Implement actual data fetching logic
  const dataSizeData = [
    { month: "Jan", Shopify: 400, Amazon: 240 },
    { month: "Feb", Shopify: 300, Amazon: 139 },
    { month: "Mar", Shopify: 200, Amazon: 980 },
    { month: "Apr", Shopify: 278, Amazon: 390 },
    { month: "May", Shopify: 189, Amazon: 480 },
    { month: "Jun", Shopify: 239, Amazon: 380 },
    { month: "Jul", Shopify: 349, Amazon: 430 },
  ]

  return NextResponse.json(dataSizeData)
}

