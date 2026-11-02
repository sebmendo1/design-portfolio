'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  PROJECT_GATE_COOKIE,
  createProjectGateToken,
  projectGateCookieOptions,
  safeNextPath,
  verifyProjectGatePassword,
} from '@/lib/project-gate';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

function gatePath(error: '1' | 'rate', next: string): string {
  return `/gate?error=${error}&next=${encodeURIComponent(next)}`;
}

export async function unlockProjectGate(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const next = safeNextPath(String(formData.get('next') ?? ''));
  const headerStore = await headers();
  const secure = headerStore.get('x-forwarded-proto')?.split(',')[0]?.trim() === 'https';

  if (!checkRateLimit(`project-gate:${getClientIp(headerStore)}`)) {
    redirect(gatePath('rate', next));
  }

  if (!verifyProjectGatePassword(password)) {
    redirect(gatePath('1', next));
  }

  const jar = await cookies();
  jar.set(PROJECT_GATE_COOKIE, createProjectGateToken(), projectGateCookieOptions(secure));
  redirect(next);
}
