'use client';

import { motion, useReducedMotion } from 'framer-motion';

const DISSOLVE_EASE = [0.25, 0.1, 0.25, 1] as const;
export const DISSOLVE_DURATION = 0.32;
export const DISSOLVE_EXIT_DURATION = 0.18;
export const DISSOLVE_STAGGER = 0.06;
export { DISSOLVE_EASE };

type DissolveInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  reveal?: boolean;
};

export function DissolveIn({
  children,
  className,
  delay = 0,
  reveal = true,
}: DissolveInProps) {
  const shouldReduce = useReducedMotion();
  const isVisible = shouldReduce || reveal;

  return (
    <motion.div
      className={className}
      initial={shouldReduce ? false : { opacity: 0, y: 12 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{
        duration: shouldReduce ? 0 : DISSOLVE_DURATION,
        delay: shouldReduce ? 0 : delay,
        ease: DISSOLVE_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
