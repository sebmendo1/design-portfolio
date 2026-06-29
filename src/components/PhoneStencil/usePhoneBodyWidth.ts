'use client';

import { useEffect, type RefObject } from 'react';

/** Keeps --body-w in sync with the laid-out stencil body for proportional bezel/buttons. */
export function usePhoneBodyWidth(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const body = root.querySelector('.phone-stencil__body') as HTMLElement | null;
    if (!body) return;

    const update = () => {
      const width = body.offsetWidth;
      if (width > 0) {
        root.style.setProperty('--body-w', `${width}px`);
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(body);

    return () => observer.disconnect();
  }, [rootRef]);
}
