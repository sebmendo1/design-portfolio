import {
  AI_ROUTE_HEADERS,
  buildPortfolioExport,
  toLlmsFullTxt,
} from '@/lib/content-export';

export async function GET() {
  const data = await buildPortfolioExport();
  return new Response(toLlmsFullTxt(data), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...AI_ROUTE_HEADERS,
    },
  });
}
