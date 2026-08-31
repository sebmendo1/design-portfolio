'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Keeps --screen-w in sync with the laid-out display so bezel and both
 * corner radii stay concentric at every size.
 */
export function usePhoneBodyWidth(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const screen = root.querySelector('.phone-stencil__screen') as HTMLElement | null;
    const body = root.querySelector('.phone-stencil__body') as HTMLElement | null;
    if (!screen && !body) return;

    const update = () => {
      const screenW = screen?.getBoundingClientRect().width ?? 0;
      const width = screenW > 0 ? screenW : (body?.getBoundingClientRect().width ?? 0);
      if (width > 0) {
        root.style.setProperty('--screen-w', `${width}px`);
      }
    };

    update();
    const observer = new ResizeObserver(update);
    if (screen) observer.observe(screen);
    if (body) observer.observe(body);

    return () => observer.disconnect();
  }, [rootRef]);
}
