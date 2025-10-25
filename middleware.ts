import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (pathname === '/' || 
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Handle dynamic username routes (public pages)
  if (pathname.length > 1 && !pathname.startsWith('/dashboard') && !pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // For dashboard routes, let NextAuth handle authentication
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
