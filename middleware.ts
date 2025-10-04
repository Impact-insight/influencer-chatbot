// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Run on all paths (Pages Router project)
export const config = { matcher: ['/:path*'] };

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow Next internals, favicon, public login page, and these APIs
  const allow =
    pathname.startsWith('/_next') ||          // Next.js assets
    pathname === '/favicon.ico' ||            // favicon
    pathname === '/login' ||                  // login page
    pathname === '/api/login' ||              // login API
    pathname === '/api/proxy' ||              // chat → n8n proxy API
    pathname === '/api/config';               // debug/config API (optional)

  if (allow) return NextResponse.next();

  // Gate everything else behind cookie set by /api/login
  const authed = req.cookies.get('site_auth')?.value === '1';
  if (authed) return NextResponse.next();

  // Not authed → redirect to /login
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}
