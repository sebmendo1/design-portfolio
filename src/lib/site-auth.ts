import { createHmac, createHash, randomBytes, timingSafeEqual } from 'crypto';

export const SITE_SESSION_COOKIE = 'site_session';

const PROTECTED_HOSTS = new Set(['sebmendo.design', 'www.sebmendo.design']);

export function isSiteProtectionEnabled(hostname: string): boolean {
  if (!process.env.SITE_PASSWORD) return false;
  return PROTECTED_HOSTS.has(hostname.toLowerCase());
}

export function createSiteSessionToken(): string {
  const secret = process.env.SITE_PASSWORD ?? '';
  const nonce = randomBytes(32).toString('hex');
  const sig = createHmac('sha256', secret).update(nonce).digest('hex');
  return `${nonce}.${sig}`;
}

export function verifySiteSessionToken(token: string | undefined): boolean {
  if (!token || !process.env.SITE_PASSWORD) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [nonce, sig] = parts;
  const expected = createHmac('sha256', process.env.SITE_PASSWORD).update(nonce).digest('hex');
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifySitePassword(password: string): boolean {
  const secret = process.env.SITE_PASSWORD ?? '';
  if (!secret) return false;

  const a = createHash('sha256').update(password).digest();
  const b = createHash('sha256').update(secret).digest();

  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
