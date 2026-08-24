'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

type ScrollRevealProps = {
  children: (revealed: boolean) => ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
};

export function ScrollReveal({
  children,
  className,
  threshold = 0.12,
  rootMargin = '0px 0px -8% 0px',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const [revealed, setRevealed] = useState(() => Boolean(shouldReduce));

  useEffect(() => {
    // Reduced-motion users get an immediate reveal via initial state / isRevealed —
    // do not sync that into state here (triggers react-hooks/set-state-in-effect).
    if (shouldReduce) {
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldReduce, threshold, rootMargin]);

  const isRevealed = revealed || !!shouldReduce;

  return <div ref={ref} className={className}>{children(isRevealed)}</div>;
}
