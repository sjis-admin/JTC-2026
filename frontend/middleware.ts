import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_AUTH_GATEWAY = process.env.NEXT_PUBLIC_ADMIN_AUTH_PATH || '/jtc-portal-auth-2026';

/**
 * Next.js Edge Middleware for Route Authentication & Security Guards
 * Runs on the Edge runtime BEFORE admin pages are rendered,
 * eliminating client-side flash and securing protected routes.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('jtc_admin_token')?.value;

  // 1. Trap and return 404 for obvious guessed/scanned admin login routes
  if (pathname === '/admin/login' || pathname === '/admin/login/' || pathname === '/login') {
    return NextResponse.rewrite(new URL('/_not-found', request.url), {
      status: 404,
    });
  }

  // 2. Handle the secret admin authentication gateway route
  if (pathname === ADMIN_AUTH_GATEWAY) {
    // If administrator already has active session, redirect directly to /admin dashboard
    if (token) {
      const target = request.nextUrl.searchParams.get('from') || '/admin';
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // 3. Protect all /admin/* subroutes
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!token) {
      const loginUrl = new URL(ADMIN_AUTH_GATEWAY, request.url);
      const fullPath = search ? `${pathname}${search}` : pathname;
      loginUrl.searchParams.set('from', fullPath);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Target all admin dashboard paths and the secret login gateway
export const config = {
  matcher: ['/admin/:path*', '/admin', '/jtc-portal-auth-2026'],
};
