import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth';
import {
  SITE_SESSION_COOKIE,
  isSiteProtectionEnabled,
  verifySiteSessionToken,
} from '@/lib/site-auth';

function handleAdminAuth(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE);
  const secret = process.env.ADMIN_SECRET;

  if (!secret || !verifySessionToken(session?.value)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

function handleSiteAuth(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SITE_SESSION_COOKIE);
  if (verifySiteSessionToken(session?.value)) {
    return null;
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isSiteProtectionEnabled()) {
    const siteResponse = handleSiteAuth(request);
    if (siteResponse) return siteResponse;
  }

  if (pathname.startsWith('/admin')) {
    return handleAdminAuth(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)',
  ],
};
