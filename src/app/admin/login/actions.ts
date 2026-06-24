'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash, timingSafeEqual } from 'crypto';
import { ADMIN_SESSION_COOKIE, createSessionToken } from '@/lib/admin-auth';

export async function loginAction(formData: FormData) {
  const password = (formData.get('password') as string) ?? '';
  const secret = process.env.ADMIN_SECRET ?? '';

  const a = createHash('sha256').update(password).digest();
  const b = createHash('sha256').update(secret).digest();

  if (!secret || !timingSafeEqual(a, b)) {
    redirect('/admin/login?error=1');
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  redirect('/admin');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}
