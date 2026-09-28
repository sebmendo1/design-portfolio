'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** A section is active once its top crosses this share of the viewport. */
const ACTIVATION_LINE = 0.35;
/** Fallback for browsers without `scrollend`. */
const LOCK_RELEASE_MS = 1200;

/**
 * Tracks which section the reader is in. `lock` pins a section while a
 * programmatic smooth scroll passes the ones in between, so the nav does not
 * flicker through every pill on the way.
 */
export function useSectionSpy(ids: readonly string[]) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);
  const lockedRef = useRef(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      if (lockedRef.current || ids.length === 0) return;

      const line = window.innerHeight * ACTIVATION_LINE;
      let next = ids[0];
      for (const id of ids) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= line) next = id;
      }

      const scroller = document.documentElement;
      if (window.innerHeight + window.scrollY >= scroller.scrollHeight - 2) {
        next = ids[ids.length - 1];
      }

      setActiveId((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids]);

  const lock = useCallback((id: string) => {
    setActiveId(id);
    lockedRef.current = true;

    let timeoutId = 0;
    const release = () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scrollend', release);
      // No re-measure here: near the page end the clicked section may never
      // reach the activation line, so it stays active until the reader scrolls.
      lockedRef.current = false;
    };

    timeoutId = window.setTimeout(release, LOCK_RELEASE_MS);
    window.addEventListener('scrollend', release, { once: true });
  }, []);

  return { activeId, lock };
}
