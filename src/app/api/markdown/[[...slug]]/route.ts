import {
  AI_CORS_HEADERS,
  AI_ROUTE_HEADERS,
  buildPortfolioExport,
} from '@/lib/content-export';
import { MARKDOWN_CONTENT_TYPE, MARKDOWN_VARY } from '@/lib/accept-markdown';
import { resolvePageMarkdown } from '@/lib/page-markdown';

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
