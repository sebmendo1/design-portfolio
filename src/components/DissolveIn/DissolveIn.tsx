'use client';

import { motion, useReducedMotion } from 'framer-motion';

const DISSOLVE_EASE = [0.25, 0.1, 0.25, 1] as const;
export const DISSOLVE_REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
export const DISSOLVE_DURATION = 0.32;
export const DISSOLVE_EXIT_DURATION = 0.18;
export const DISSOLVE_STAGGER = 0.06;
export const DISSOLVE_REVEAL_DURATION = 0.72;
export const DISSOLVE_REVEAL_STAGGER = 0.14;
export const DISSOLVE_SUBTLE_DURATION = 0.4;
export const DISSOLVE_SUBTLE_STAGGER = 0.05;
export const DISSOLVE_SUBTLE_OFFSET = 6;
export const DISSOLVE_SUBTLE_BLUR = 4;
export { DISSOLVE_EASE };

type DissolveInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  reveal?: boolean;
  duration?: number;
  ease?: readonly [number, number, number, number];
  offset?: number;
  blur?: number;
};

export function DissolveIn({
  children,
  className,
  delay = 0,
  reveal = true,
  duration = DISSOLVE_DURATION,
  ease = DISSOLVE_EASE,
  offset = 12,
  blur = 0,
}: DissolveInProps) {
  const shouldReduce = useReducedMotion();
  const isVisible = shouldReduce || reveal;
  const visible = blur
    ? { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }
    : { opacity: 1, y: 0 };
  const hidden = blur
    ? { opacity: 0, y: offset, filter: `blur(${blur}px)` }
    : { opacity: 0, y: offset };

  return (
    <motion.div
      className={className}
      initial={false}
      animate={isVisible ? visible : hidden}
      transition={{
        duration: shouldReduce ? 0 : duration,
        delay: shouldReduce ? 0 : delay,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}
