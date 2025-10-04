// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = { matcher: ['/:path*'] }

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow Next internals, favicon, login page + APIs, AND the proxy
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/login' ||
    pathname === '/api/login' ||
    pathname === '/api/proxy'   // ← add this
  ) {
    return NextResponse.next()
  }

  // Gate everything else behind cookie set by /api/login
  if (req.cookies.get('site_auth')?.value === '1') return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  return NextResponse.redirect(url)
}
