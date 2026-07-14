'use client';

import { Navigation } from '@/components/Navigation/Navigation';

export function AboutPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main id="main-content">{children}</main>
    </>
  );
}
