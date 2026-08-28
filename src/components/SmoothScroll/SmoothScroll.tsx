'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis } from 'lenis/react';

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const [reduceMotion, setReduceMotion] = useState(false);
  const useNativeScroll = pathname === '/';

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!useNativeScroll) return;

    const root = document.documentElement;
    root.classList.add('home-native-scroll');
    return () => root.classList.remove('home-native-scroll');
  }, [useNativeScroll]);

  if (reduceMotion || useNativeScroll) {
    return children;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
