import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SmoothScroll } from '@/components/SmoothScroll/SmoothScroll';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { sebSansVar } from '@/lib/fonts';
import { buildSiteGraph } from '@/lib/json-ld';
import { createMetadata } from '@/lib/metadata';
import './globals.css';

export const metadata: Metadata = createMetadata({
  alternates: {
    types: {
      'text/plain': [
        { url: '/.well-known/ai.txt', title: 'Agent discovery guide' },
        { url: '/llms.txt', title: 'LLM-readable index' },
        { url: '/llms-full.txt', title: 'LLM-readable full corpus' },
      ],
      'application/json': [{ url: '/content.json', title: 'Structured portfolio content' }],
    },
  },
  other: {
    'portfolio-machine-readable':
      '/content.json | /llms.txt | /llms-full.txt | /.well-known/ai.txt',
  },
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f8f8f8',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sebSansVar.variable}>
      <head>
        <link
          rel="alternate"
          type="application/json"
          href="/content.json"
          title="Portfolio JSON"
        />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLM index"
        />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms-full.txt"
          title="LLM full corpus"
        />
        <link
          rel="alternate"
          type="text/plain"
          href="/.well-known/ai.txt"
          title="Agent guide"
        />
      </head>
      <body suppressHydrationWarning>
        <StructuredData data={buildSiteGraph()} />
        {/* PORTFOLIO-MACHINE-READABLE: /content.json | /llms.txt | /llms-full.txt | /.well-known/ai.txt */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
