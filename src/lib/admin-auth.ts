import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'admin_session';

export function createSessionToken(): string {
  const secret = process.env.ADMIN_SECRET ?? '';
  const nonce = randomBytes(32).toString('hex');
  const sig = createHmac('sha256', secret).update(nonce).digest('hex');
  return `${nonce}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !process.env.ADMIN_SECRET) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [nonce, sig] = parts;
  const expected = createHmac('sha256', process.env.ADMIN_SECRET).update(nonce).digest('hex');
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(session)) {
    throw new Error('Unauthorized');
  }
}

export function sanitizeMediaUrl(url: string | undefined): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith('/assets/')) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return undefined;
    return parsed.toString();
  } catch {
    return undefined;
  }
}

export function sanitizeMediaData(media: {
  thumbnail?: string;
  preview?: { src?: string; video?: string; url?: string };
  centerpiece?: { src?: string; video?: string; url?: string };
}): typeof media {
  return {
    thumbnail: sanitizeMediaUrl(media.thumbnail),
    preview: media.preview
      ? {
          src: sanitizeMediaUrl(media.preview.src),
          video: sanitizeMediaUrl(media.preview.video),
          url: sanitizeMediaUrl(media.preview.url),
        }
      : undefined,
    centerpiece: media.centerpiece
      ? {
          src: sanitizeMediaUrl(media.centerpiece.src),
          video: sanitizeMediaUrl(media.centerpiece.video),
          url: sanitizeMediaUrl(media.centerpiece.url),
        }
      : undefined,
  };
}
