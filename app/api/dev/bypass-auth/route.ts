import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  // Create response with redirect to sources page
  const response = NextResponse.redirect(new URL('/sources', request.url));

  // Set the bypass cookie (expires in 24 hours)
  response.cookies.set({
    name: 'bypassAuth',
    value: 'true',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: false, // No need for secure in development
  });

  return response;
}