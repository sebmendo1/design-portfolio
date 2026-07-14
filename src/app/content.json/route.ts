import {
  AI_ROUTE_HEADERS,
  buildPortfolioExport,
  toContentJson,
} from '@/lib/content-export';

export async function GET() {
  const data = await buildPortfolioExport();
  return new Response(toContentJson(data), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      ...AI_ROUTE_HEADERS,
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
