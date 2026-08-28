'use client';

import { useEffect, type RefObject } from 'react';

function normalizeWheelDelta(deltaY: number, deltaMode: number): number {
  if (deltaMode === 1) return deltaY * 16;
  if (deltaMode === 2) return deltaY * (typeof window === 'undefined' ? 800 : window.innerHeight);
  return deltaY;
}

/**
 * iPadOS + Safari often ignore trackpad/mouse wheel on nested overflow
 * panes when ancestors are overflow-hidden. Apply wheel deltas directly
 * so the pane scrolls with touch, mouse, and trackpad on every form factor.
 */
export function useNativePaneScroll(
  paneRef: RefObject<HTMLElement | null>,
  scrollerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const pane = paneRef.current;
    const scroller = scrollerRef.current;
    if (!pane || !scroller) return;

    const onWheel = (event: WheelEvent) => {
      if (!scroller.contains(event.target as Node) && !pane.contains(event.target as Node)) {
        return;
      }

      const delta = normalizeWheelDelta(event.deltaY, event.deltaMode);
      if (delta === 0) return;

      const max = scroller.scrollHeight - scroller.clientHeight;
      if (max <= 0) return;

      const next = Math.min(max, Math.max(0, scroller.scrollTop + delta));
      if (next === scroller.scrollTop) {
        event.preventDefault();
        return;
      }

      scroller.scrollTop = next;
      event.preventDefault();
    };

    pane.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => pane.removeEventListener('wheel', onWheel, true);
  }, [paneRef, scrollerRef]);
}
