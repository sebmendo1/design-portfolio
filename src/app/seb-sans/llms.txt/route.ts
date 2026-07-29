import { getLlmsTxt } from '@/lib/seb-sans/agent-manifest';

export async function GET() {
  return new Response(getLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
