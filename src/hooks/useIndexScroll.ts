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

function scrollPaneBy(scroller: HTMLElement, delta: number): boolean {
  const max = scroller.scrollHeight - scroller.clientHeight;
  if (max <= 0) return false;

  scroller.scrollTop = Math.min(max, Math.max(0, scroller.scrollTop + delta));
  return true;
}

/**
 * Complete scrolling for `.portfolio-index__pane--rail` on tablet and computer:
 * native overflow for touch on the pane, window-captured wheel/trackpad so
 * iPadOS and hover-over-preview still move this column.
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
      if (event.ctrlKey) return;

      const delta = normalizeWheelDelta(event.deltaY, event.deltaMode);
      if (delta === 0) return;
      if (!scrollPaneBy(scroller, delta)) return;
      if (event.cancelable) event.preventDefault();
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
      if (event.cancelable) event.preventDefault();
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
