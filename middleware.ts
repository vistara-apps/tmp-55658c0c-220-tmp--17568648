import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/subscription', '/onboarding'];
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  // If it's not a protected route, allow the request
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // Check for authentication token in cookies
  // In a real app, we would verify the token
  // For now, we'll just check if it exists
  const authToken = request.cookies.get('authToken')?.value;
  
  // If there's no token and it's a protected route, redirect to home
  if (!authToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Allow the request
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/subscription/:path*', '/onboarding/:path*'],
};

