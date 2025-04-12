import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { authConfig } from '@/app/(auth)/auth.config';

// Auth middleware
const { auth } = NextAuth(authConfig);

// API error handling middleware
async function apiMiddleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      return NextResponse.next();
    } catch (error) {
      console.error('API error in middleware:', error);
      return new NextResponse(
        JSON.stringify({ message: 'Ndodhi një gabim i papritur' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  }
  return NextResponse.next();
}

// Combined middleware
export async function middleware(request: NextRequest) {
  // API error handling first
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return apiMiddleware(request);
  }
  
  // Then auth middleware for protected routes
  return auth(request);
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register'],
};
