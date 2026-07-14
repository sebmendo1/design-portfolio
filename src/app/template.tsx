'use client';

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';

function RouteTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

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
