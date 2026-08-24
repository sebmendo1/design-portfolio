'use client';

import { useEffect, type RefObject } from 'react';
import { BROWSER_COMPACT_WIDTH, BROWSER_TINY_WIDTH } from './browser-aspect-ratios';

/** Keeps --browser-w in sync with the laid-out frame for proportional chrome scaling. */
export function useBrowserFrameWidth(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const update = () => {
      const width = root.offsetWidth;
      if (width > 0) {
        root.style.setProperty('--browser-w', `${width}px`);
        root.classList.toggle('browser-stencil--compact', width < BROWSER_COMPACT_WIDTH);
        root.classList.toggle('browser-stencil--tiny', width < BROWSER_TINY_WIDTH);
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);

    return () => observer.disconnect();
  }, [rootRef]);
}
