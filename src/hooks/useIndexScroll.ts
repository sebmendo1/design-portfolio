'use client';

import { useEffect, type RefObject } from 'react';
import Lenis from 'lenis';
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
 * Scroll `.portfolio-index__pane--rail` on computer and tablet.
 * Native overflow covers touch and in-pane wheel. Window-level Lenis
 * (same pattern as case studies) covers trackpads that deliver wheel
 * to the window instead of the nested pane.
 */
export function useIndexScroll(
  layoutRef: RefObject<HTMLElement | null>,
  scrollerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const layout = layoutRef.current;
    const scroller = scrollerRef.current;
    const content = contentRef.current;
    if (!layout || !scroller || !content) return;

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup: (() => void) | undefined;

    const setup = () => {
      cleanup?.();

      const prefersReduced = reducedQuery.matches;
      const enableTouchScroll = caseStudySupportsTouchScroll();
      layout.dataset.touchScroll = enableTouchScroll ? 'true' : 'false';
      scroller.style.overflowY = 'scroll';

      const onWheel = (event: WheelEvent) => {
        if (event.ctrlKey) return;

        const delta = normalizeWheelDelta(event.deltaY, event.deltaMode);
        if (delta === 0) return;
        if (!scrollPaneBy(scroller, delta)) return;
        if (event.cancelable) event.preventDefault();
      };

      if (prefersReduced) {
        window.addEventListener('wheel', onWheel, { passive: false, capture: true });
        cleanup = () => {
          window.removeEventListener('wheel', onWheel, true);
          scroller.style.overflowY = '';
        };
        return;
      }

      const lenis = new Lenis({
        wrapper: scroller,
        content,
        eventsTarget: window,
        smoothWheel: true,
        syncTouch: enableTouchScroll,
        syncTouchLerp: 0.09,
        touchMultiplier: 1.4,
        lerp: 0.09,
      });

      let rafId = 0;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      cleanup = () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        scroller.style.overflowY = '';
      };
    };

    setup();
    reducedQuery.addEventListener('change', setup);

    return () => {
      reducedQuery.removeEventListener('change', setup);
      cleanup?.();
      delete layout.dataset.touchScroll;
    };
  }, [contentRef, layoutRef, scrollerRef]);
}
