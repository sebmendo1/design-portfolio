'use client';

import { useEffect, type RefObject } from 'react';
import { caseStudySupportsTouchScroll } from '@/lib/case-study-layout';

function normalizeWheelDelta(deltaY: number, deltaMode: number): number {
  if (deltaMode === 1) return deltaY * 16;
  if (deltaMode === 2) {
    return deltaY * (typeof window === 'undefined' ? 800 : window.innerHeight);
  }
  return deltaY;
}

/**
 * iPadOS Safari sends Magic Keyboard / trackpad wheel to `window`, not the
 * nested overflow pane. Capture those events and move the work list so
 * mouse, trackpad, and touch all scroll it.
 */
export function useIndexScroll(
  layoutRef: RefObject<HTMLElement | null>,
  scrollerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const layout = layoutRef.current;
    const scroller = scrollerRef.current;
    if (!layout || !scroller) return;

    const enableTouchScroll = caseStudySupportsTouchScroll();
    layout.dataset.touchScroll = enableTouchScroll ? 'true' : 'false';

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.defaultPrevented) return;

      const delta = normalizeWheelDelta(event.deltaY, event.deltaMode);
      if (delta === 0) return;

      const max = scroller.scrollHeight - scroller.clientHeight;
      if (max <= 0) return;

      scroller.scrollTop = Math.min(max, Math.max(0, scroller.scrollTop + delta));
      event.preventDefault();
    };

    let touchStartY = 0;
    let scrollStartTop = 0;

    const onTouchStart = (event: TouchEvent) => {
      if (scroller.contains(event.target as Node)) return;
      touchStartY = event.touches[0]?.clientY ?? 0;
      scrollStartTop = scroller.scrollTop;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (scroller.contains(event.target as Node)) return;
      const currentY = event.touches[0]?.clientY ?? touchStartY;
      scroller.scrollTop = scrollStartTop + (touchStartY - currentY);
      event.preventDefault();
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });

    if (enableTouchScroll) {
      layout.addEventListener('touchstart', onTouchStart, { passive: true });
      layout.addEventListener('touchmove', onTouchMove, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', onWheel, true);
      layout.removeEventListener('touchstart', onTouchStart);
      layout.removeEventListener('touchmove', onTouchMove);
      delete layout.dataset.touchScroll;
    };
  }, [layoutRef, scrollerRef]);
}
