import { getAgentManifestJson } from '@/lib/seb-sans/agent-manifest';

export async function GET() {
  return new Response(getAgentManifestJson(), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
