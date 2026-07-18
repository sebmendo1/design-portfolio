'use client';

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';

function RouteTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, lenis]);

  return (
    <div className="route-template" key={pathname}>
      {children}
    </div>
  );
}

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="route-template">{children}</div>}>
      <RouteTemplate>{children}</RouteTemplate>
    </Suspense>
  );
}
