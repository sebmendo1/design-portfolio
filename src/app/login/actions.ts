'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SITE_SESSION_COOKIE,
  createSiteSessionToken,
  verifySitePassword,
} from '@/lib/site-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }
  return value;
}

export async function siteLoginAction(formData: FormData) {
  const password = (formData.get('password') as string) ?? '';
  const redirectTo = safeRedirectPath((formData.get('redirect') as string) ?? null);
  const headersList = await headers();
  const clientIp = getClientIp(headersList);

  if (!checkRateLimit(`site-login:${clientIp}`)) {
    redirect(`/login?error=1&redirect=${encodeURIComponent(redirectTo)}`);
  }

  if (!verifySitePassword(password)) {
    redirect(`/login?error=1&redirect=${encodeURIComponent(redirectTo)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(SITE_SESSION_COOKIE, createSiteSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  redirect(redirectTo);
}
