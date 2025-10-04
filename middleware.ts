// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Run on all paths
export const config = { matcher: ['/:path*'] }

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow Next internals, favicon, login page, login API, AND the proxy
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/login' ||
    pathname === '/api/login' ||
    pathname === '/api/proxy'      // ← add this line
  ) {
    return NextResponse.next()
  }

  // Gate everything else behind cookie (make sure your login sets this cookie)
  if (req.cookies.get('site_auth')?.value === '1') return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  return NextResponse.redirect(url)
}
