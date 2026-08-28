'use client';

import { useEffect } from 'react';

function normalizeWheelDelta(deltaY: number, deltaMode: number): number {
  if (deltaMode === 1) return deltaY * 16;
  if (deltaMode === 2) {
    return deltaY * (typeof window === 'undefined' ? 800 : window.innerHeight);
  }
  return deltaY;
}

function getScrollingElement(): Element | null {
  return document.scrollingElement ?? document.documentElement;
}

/**
 * Home index uses the document as the scroller so iPadOS trackpads work.
 * Wheel over overflow-hidden preview chrome is still forwarded to the page
 * when the event is cancelable (desktop / some iPad builds).
 */
export function useIndexScroll() {
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.defaultPrevented || !event.cancelable) return;

      const scroller = getScrollingElement();
      if (!scroller) return;

      const delta = normalizeWheelDelta(event.deltaY, event.deltaMode);
      if (delta === 0) return;

      const max = scroller.scrollHeight - scroller.clientHeight;
      if (max <= 0) return;

      scroller.scrollTop = Math.min(max, Math.max(0, scroller.scrollTop + delta));
      event.preventDefault();
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', onWheel, true);
  }, []);
}
