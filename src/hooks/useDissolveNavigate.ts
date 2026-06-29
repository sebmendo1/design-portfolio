'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { DISSOLVE_EASE, DISSOLVE_EXIT_DURATION } from '@/components/DissolveIn/DissolveIn';

export function useDissolveNavigate() {
  const router = useRouter();
  const shouldReduce = useReducedMotion();
  const [exitHref, setExitHref] = useState<string | null>(null);
  const hasNavigatedRef = useRef(false);
  const isExiting = exitHref !== null;

  const navigate = useCallback(
    (href: string) => {
      if (shouldReduce) {
        router.push(href);
        return;
      }
      if (isExiting) return;
      setExitHref(href);
    },
    [isExiting, router, shouldReduce],
  );

  const onExitComplete = useCallback(() => {
    if (!exitHref || hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    router.push(exitHref);
  }, [exitHref, router]);

  const motionProps = {
    animate:
      shouldReduce || !isExiting
        ? { opacity: 1, y: 0 }
        : { opacity: 0, y: -12 },
    transition: {
      duration: shouldReduce ? 0 : isExiting ? DISSOLVE_EXIT_DURATION : 0,
      ease: DISSOLVE_EASE,
    },
    onAnimationComplete: onExitComplete,
    style: { pointerEvents: isExiting ? ('none' as const) : undefined },
  };

  return { navigate, isExiting, motionProps };
}
