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
      const screenWidth = screen?.getBoundingClientRect().width ?? 0;
      if (screenWidth > 0) {
        const next = Math.round(screenWidth * 100) / 100;
        setScreenW((prev) => (prev !== null && Math.abs(prev - next) < 0.5 ? prev : next));
        return;
      }

      if (!body) return;
      const style = getComputedStyle(body);
      const pad =
        (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
      const inner = body.clientWidth - pad;
      if (inner <= 0) return;
      const next = Math.round(inner * 100) / 100;
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
