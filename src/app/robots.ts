import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

const AI_BOTS = [
  // Search / retrieval (cite you)
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'ChatGPT-User',
  'Claude-User',
  'Perplexity-User',
  // Training crawlers
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
] as const;

const DISALLOWED = ['/admin/', '/api/'];

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOWED },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOWED,
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
