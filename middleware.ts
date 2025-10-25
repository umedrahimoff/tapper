import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Protect dashboard routes
  if (nextUrl.pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/signin', nextUrl))
    }
  }

  // Allow public routes
  if (nextUrl.pathname === '/' || 
      nextUrl.pathname.startsWith('/api/auth') ||
      nextUrl.pathname.startsWith('/auth') ||
      nextUrl.pathname.startsWith('/_next') ||
      nextUrl.pathname.startsWith('/favicon.ico')) {
    return NextResponse.next()
  }

  // Handle dynamic username routes
  if (nextUrl.pathname.length > 1 && !nextUrl.pathname.startsWith('/api') && !nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
