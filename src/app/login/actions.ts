'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SITE_SESSION_COOKIE,
  createSiteSessionToken,
  verifySitePassword,
} from '@/lib/site-auth';

function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }
  return value;
}

export async function siteLoginAction(formData: FormData) {
  const password = (formData.get('password') as string) ?? '';
  const redirectTo = safeRedirectPath((formData.get('redirect') as string) ?? null);

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
