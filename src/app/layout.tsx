import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SmoothScroll } from '@/components/SmoothScroll/SmoothScroll';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { buildSiteGraph } from '@/lib/json-ld';
import { createMetadata } from '@/lib/metadata';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

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
    <html lang="en" className={inter.className}>
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
