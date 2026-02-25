import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Protect account routes
  if (pathname.startsWith('/account')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect logged-in users away from auth pages
  if (isAuthenticated && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/account', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/account/:path*', '/auth/login', '/auth/register'],
}
