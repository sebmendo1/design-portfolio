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
        { url: '/llms.txt', title: 'LLM-readable index' },
        { url: '/llms-full.txt', title: 'LLM-readable full corpus' },
      ],
      'application/json': [{ url: '/content.json', title: 'Structured portfolio content' }],
    },
  },
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sebSansVar.variable}>
      <body suppressHydrationWarning>
        <StructuredData data={buildSiteGraph()} />
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
