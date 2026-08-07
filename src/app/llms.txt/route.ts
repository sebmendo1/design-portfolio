import {
  AI_CORS_HEADERS,
  AI_ROUTE_HEADERS,
  buildPortfolioExport,
  toLlmsTxt,
} from '@/lib/content-export';

export async function GET() {
  const data = await buildPortfolioExport();
  return new Response(toLlmsTxt(data), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...AI_CORS_HEADERS,
      ...AI_ROUTE_HEADERS,
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: AI_CORS_HEADERS,
  });
}
