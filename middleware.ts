import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Allow public routes
  const publicRoutes = ['/', '/auth/signin', '/[username]']
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/[username]') {
      return request.nextUrl.pathname !== '/' && !request.nextUrl.pathname.startsWith('/api')
    }
    return request.nextUrl.pathname === route
  })
  
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    if (session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
