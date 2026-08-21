/**
 * Accept parsing and content negotiation for acceptmarkdown.com.
 * Follows RFC 9110 §12.5.1 q-value ranking and the Next.js recipe at
 * https://acceptmarkdown.com/recipes/nextjs
 */

export const MARKDOWN_PRODUCES = ['text/html', 'text/markdown'] as const;

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';
export const MARKDOWN_VARY = 'Accept, Accept-Encoding';

type AcceptEntry = { type: string; q: number; specificity: number };

export function parseAccept(header: string): AcceptEntry[] {
  return header.split(',').map((raw) => {
    const parts = raw
      .trim()
      .split(';')
      .map((s) => s.trim());
    const type = (parts[0] ?? '').toLowerCase();
    let q = 1;
    for (const param of parts.slice(1)) {
      const [name, value] = param.split('=').map((s) => s.trim());
      if (name === 'q') {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
      }
    }
    const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2;
    return { type, q, specificity };
  });
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === '*/*') return true;
  if (entry.type.endsWith('/*')) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

/** Highest-ranked type we produce, or null when every candidate is rejected. */
export function preferredType(
  header: string | null,
  produces: readonly string[] = MARKDOWN_PRODUCES,
): string | null {
  if (!header) return produces[0] ?? null;
  const entries = parseAccept(header);
  if (entries.length === 0) return produces[0] ?? null;

  let bestType: string | null = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of produces) {
    let matched: AcceptEntry | null = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx += 1) {
      const entry = entries[idx];
      if (!matches(entry, candidate)) continue;
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = entry;
        matchedPosition = idx;
      }
    }
    if (matched === null) continue;
    if (matched.q <= 0) continue;

    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }

  return bestType;
}

export function prefersMarkdown(header: string | null): boolean {
  return preferredType(header) === 'text/markdown';
}

export function appendVaryAccept(headers: Headers, extra = 'Accept-Encoding'): void {
  const tokens = new Set(
    (headers.get('Vary') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );

  const varyNames = ['Accept', extra];
  for (const name of varyNames) {
    const already = [...tokens].some((token) => token.toLowerCase() === name.toLowerCase());
    if (!already) tokens.add(name);
  }

  headers.set('Vary', [...tokens].join(', '));
}

export function isRscNavigationRequest(headers: Headers): boolean {
  if (headers.get('rsc') === '1') return true;
  if (headers.get('next-router-prefetch')) return true;
  if (headers.get('next-router-state-tree')) return true;
  if (headers.get('next-router-segment-prefetch')) return true;
  const accept = headers.get('accept') ?? '';
  return accept.includes('text/x-component');
}

export function isMarkdownNegotiablePath(pathname: string): boolean {
  if (pathname.startsWith('/admin')) return false;
  if (pathname.startsWith('/login')) return false;
  if (pathname.startsWith('/api/')) return false;
  if (pathname.startsWith('/_next/')) return false;
  if (pathname.startsWith('/assets/')) return false;
  return true;
}

export function markdownRewritePath(pathname: string): string {
  const normalized = pathname.endsWith('.md') ? pathname.slice(0, -3) || '/' : pathname;
  if (normalized === '/') return '/api/markdown';
  return `/api/markdown${normalized}`;
}

export const NOT_ACCEPTABLE_BODY = 'Not Acceptable\n\nAvailable: text/html, text/markdown\n';
