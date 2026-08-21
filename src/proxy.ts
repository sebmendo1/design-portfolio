import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth';
import {
  appendVaryAccept,
  isMarkdownNegotiablePath,
  isRscNavigationRequest,
  markdownRewritePath,
  NOT_ACCEPTABLE_BODY,
  preferredType,
} from '@/lib/accept-markdown';
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

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/seb-sans') ||
    pathname.startsWith('/api/markdown')
  ) {
    return null;
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

  if (isSiteProtectionEnabled(request.nextUrl.hostname)) {
    const siteResponse = handleSiteAuth(request);
    if (siteResponse) return siteResponse;
  }

  if (pathname.startsWith('/admin')) {
    return handleAdminAuth(request);
  }

  return negotiateMarkdown(request);
}

function negotiateMarkdown(request: NextRequest): NextResponse | Response {
  const { pathname } = request.nextUrl;

  if (!isMarkdownNegotiablePath(pathname) || isRscNavigationRequest(request.headers)) {
    const passthrough = NextResponse.next();
    appendVaryAccept(passthrough.headers);
    return passthrough;
  }

  if (pathname.endsWith('.md')) {
    const url = request.nextUrl.clone();
    url.pathname = markdownRewritePath(pathname);
    const rewritten = NextResponse.rewrite(url);
    appendVaryAccept(rewritten.headers);
    return rewritten;
  }

  const acceptHeader = request.headers.get('accept');
  const chosen = preferredType(acceptHeader);

  if (chosen === 'text/markdown') {
    const url = request.nextUrl.clone();
    url.pathname = markdownRewritePath(pathname);
    const rewritten = NextResponse.rewrite(url);
    appendVaryAccept(rewritten.headers);
    return rewritten;
  }

  if (chosen === null && acceptHeader) {
    return new Response(NOT_ACCEPTABLE_BODY, {
      status: 406,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        Vary: 'Accept, Accept-Encoding',
      },
    });
  }

  const res = NextResponse.next();
  appendVaryAccept(res.headers);
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)',
  ],
};
