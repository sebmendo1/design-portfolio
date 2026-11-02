import { createHmac, createHash, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Password for /work project pages. Read PROJECT_GATE_PASSWORD on the server.
 * When it is unset, local dev uses the documented default below.
 * Change the live password in the host environment and redeploy — no code edit.
 * Do not import this module from a client component.
 */
const LOCAL_DEFAULT_PASSWORD = 'sebmendodesign';

export const PROJECT_GATE_COOKIE = 'project_gate';

export function projectGatePassword(): string {
  const configured = process.env.PROJECT_GATE_PASSWORD?.trim();
  if (configured) return configured;
  return LOCAL_DEFAULT_PASSWORD;
}

export function verifyProjectGatePassword(password: string): boolean {
  const secret = projectGatePassword();
  const given = createHash('sha256').update(password, 'utf8').digest();
  const expected = createHash('sha256').update(secret, 'utf8').digest();
  return timingSafeEqual(given, expected);
}

export function createProjectGateToken(): string {
  const nonce = randomBytes(32).toString('hex');
  const sig = createHmac('sha256', projectGatePassword())
    .update(`project-gate:${nonce}`)
    .digest('hex');
  return `${nonce}.${sig}`;
}

export function verifyProjectGateToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [nonce, sig] = parts;
  if (!nonce || !sig) return false;
  const expected = createHmac('sha256', projectGatePassword())
    .update(`project-gate:${nonce}`)
    .digest('hex');
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** Session cookie: no maxAge or expires, so the browser drops it when the session ends. */
export function projectGateCookieOptions(secure: boolean) {
  return {
    httpOnly: true as const,
    secure,
    sameSite: 'lax' as const,
    path: '/',
  };
}

export function normalizeProjectPath(pathname: string): string {
  let path = pathname.split('?')[0] ?? pathname;
  if (path.endsWith('.md')) path = path.slice(0, -3) || '/';
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  if (!path.startsWith('/')) path = `/${path}`;
  return path || '/';
}

const PUBLIC_PROJECT_ASSET =
  /\/(?:opengraph-image|twitter-image|icon|apple-icon)(?:\/|\.|$)/;

/** Case-study pages and their same-URL markdown / per-project JSON. */
export function isProtectedProjectPath(pathname: string): boolean {
  const path = normalizeProjectPath(pathname);
  if (PUBLIC_PROJECT_ASSET.test(path)) return false;
  if (path === '/work' || path.startsWith('/work/')) return true;
  if (path === '/api/markdown/work' || path.startsWith('/api/markdown/work/')) return true;
  return false;
}

/** Same-origin return path. Anything else goes home. */
export function safeNextPath(value: string | null | undefined): string {
  if (!value) return '/';
  const next = value.trim();
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return '/';
  if (next.includes('\\') || next.includes('://') || /[\r\n\0]/.test(next)) return '/';
  if (next === '/gate' || next.startsWith('/gate?') || next.startsWith('/gate/')) return '/';
  return next;
}

export function projectGateHref(nextPath: string): string {
  return `/gate?next=${encodeURIComponent(safeNextPath(nextPath))}`;
}
