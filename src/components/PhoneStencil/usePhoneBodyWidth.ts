'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Measures the laid-out display width so bezel and both corner radii
 * stay concentric at every size. The value must live in React state —
 * writing it onto the DOM node is overwritten by the style prop.
 */
export function usePhoneBodyWidth(rootRef: RefObject<HTMLDivElement | null>) {
  const [screenW, setScreenW] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const screen = root.querySelector('.phone-stencil__screen') as HTMLElement | null;
    const body = root.querySelector('.phone-stencil__body') as HTMLElement | null;
    if (!screen && !body) return;

    const update = () => {
      const measured = screen?.getBoundingClientRect().width ?? 0;
      const width = measured > 0 ? measured : (body?.getBoundingClientRect().width ?? 0);
      if (width <= 0) return;
      const next = Math.round(width * 100) / 100;
      setScreenW((prev) => (prev !== null && Math.abs(prev - next) < 0.5 ? prev : next));
    };

    update();
    const observer = new ResizeObserver(update);
    if (screen) observer.observe(screen);
    if (body) observer.observe(body);

    return () => observer.disconnect();
  }, [rootRef]);

  return screenW;
}
