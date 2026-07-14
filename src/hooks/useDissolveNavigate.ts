'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { DISSOLVE_EASE, DISSOLVE_EXIT_DURATION } from '@/components/DissolveIn/DissolveIn';

export function useDissolveNavigate() {
  const router = useRouter();
  const shouldReduce = useReducedMotion();
  const [exitHref, setExitHref] = useState<string | null>(null);
  const exitHrefRef = useRef<string | null>(null);
  const hasNavigatedRef = useRef(false);
  const isExiting = exitHref !== null;

  const completeExit = useCallback(() => {
    const href = exitHrefRef.current;
    if (!href || hasNavigatedRef.current) return;

    hasNavigatedRef.current = true;
    router.push(href);
  }, [router]);

  const navigate = useCallback(
    (href: string) => {
      if (shouldReduce) {
        router.push(href);
        return;
      }
      if (exitHrefRef.current) return;

      hasNavigatedRef.current = false;
      exitHrefRef.current = href;
      setExitHref(href);
    },
    [router, shouldReduce],
  );

  useEffect(() => {
    if (!exitHref || shouldReduce) return;

    const fallbackMs = DISSOLVE_EXIT_DURATION * 1000 + 100;
    const fallbackId = window.setTimeout(completeExit, fallbackMs);

    return () => window.clearTimeout(fallbackId);
  }, [completeExit, exitHref, shouldReduce]);

  const onExitComplete = useCallback(() => {
    if (!exitHrefRef.current) return;
    completeExit();
  }, [completeExit]);

  const motionProps = {
    animate:
      shouldReduce || !isExiting
        ? { opacity: 1, y: 0 }
        : { opacity: 0, y: -12 },
    transition: {
      duration: shouldReduce ? 0 : isExiting ? DISSOLVE_EXIT_DURATION : 0,
      ease: DISSOLVE_EASE,
    },
    onAnimationComplete: isExiting ? onExitComplete : undefined,
    style: { pointerEvents: isExiting ? ('none' as const) : undefined },
  };

  return { navigate, isExiting, motionProps };
}
