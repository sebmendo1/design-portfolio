import { cookies } from 'next/headers';
import {
  AI_CORS_HEADERS,
  AI_ROUTE_HEADERS,
  buildPortfolioExport,
} from '@/lib/content-export';
import { MARKDOWN_CONTENT_TYPE, MARKDOWN_VARY } from '@/lib/accept-markdown';
import { resolvePageMarkdown } from '@/lib/page-markdown';
import { isProtectedProjectPath, PROJECT_GATE_COOKIE, verifyProjectGateToken } from '@/lib/project-gate';

type Params = { params: Promise<{ slug?: string[] }> };

function markdownHeaders(): HeadersInit {
  return {
    'Content-Type': MARKDOWN_CONTENT_TYPE,
    Vary: MARKDOWN_VARY,
    ...AI_CORS_HEADERS,
    ...AI_ROUTE_HEADERS,
  };
}

export async function GET(_request: Request, { params }: Params) {
  const { slug = [] } = await params;
  const pathname = slug.length ? `/${slug.join('/')}` : '/';

  if (isProtectedProjectPath(pathname)) {
    const token = (await cookies()).get(PROJECT_GATE_COOKIE)?.value;
    if (!verifyProjectGateToken(token)) {
      return new Response('Unauthorized\n', {
        status: 401,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'private, no-store',
          Vary: MARKDOWN_VARY,
        },
      });
    }
  }

  const data = await buildPortfolioExport();
  const result = resolvePageMarkdown(pathname, data);

  return new Response(result.body, {
    status: result.status,
    headers: markdownHeaders(),
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...AI_CORS_HEADERS,
      Vary: MARKDOWN_VARY,
    },
  });
}
