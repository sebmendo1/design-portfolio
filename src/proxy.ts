import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth';
import {
  MARKDOWN_CONTENT_TYPE,
  MARKDOWN_VARY,
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

export async function proxy(request: NextRequest) {
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

const INTERNAL_MARKDOWN_HEADER = 'x-markdown-internal';

async function serveMarkdown(request: NextRequest, pathname: string): Promise<Response> {
  const url = request.nextUrl.clone();
  url.pathname = markdownRewritePath(pathname);

  const incoming = new Headers(request.headers);
  incoming.set(INTERNAL_MARKDOWN_HEADER, '1');
  incoming.set('accept', 'text/markdown');

  const origin = await fetch(url, {
    headers: incoming,
    redirect: 'manual',
  });

  const headers = new Headers();
  headers.set('Content-Type', MARKDOWN_CONTENT_TYPE);
  headers.set('Vary', MARKDOWN_VARY);

  origin.headers.forEach((value, key) => {
    const name = key.toLowerCase();
    if (
      name === 'content-type' ||
      name === 'vary' ||
      name === 'content-encoding' ||
      name === 'content-length' ||
      name === 'transfer-encoding'
    ) {
      return;
    }
    headers.set(key, value);
  });

  return new Response(origin.body, {
    status: origin.status,
    headers,
  });
}

async function negotiateMarkdown(request: NextRequest): Promise<NextResponse | Response> {
  const { pathname } = request.nextUrl;

  if (request.headers.get(INTERNAL_MARKDOWN_HEADER) === '1') {
    return NextResponse.next();
  }

  if (!isMarkdownNegotiablePath(pathname) || isRscNavigationRequest(request.headers)) {
    const passthrough = NextResponse.next();
    appendVaryAccept(passthrough.headers);
    return passthrough;
  }

  if (pathname.endsWith('.md')) {
    return serveMarkdown(request, pathname);
  }

  const acceptHeader = request.headers.get('accept');
  const chosen = preferredType(acceptHeader);

  if (chosen === 'text/markdown') {
    return serveMarkdown(request, pathname);
  }

  if (chosen === null && acceptHeader) {
    return new Response(NOT_ACCEPTABLE_BODY, {
      status: 406,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        Vary: MARKDOWN_VARY,
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
