'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { DISSOLVE_DURATION, DISSOLVE_EASE } from '@/components/DissolveIn/DissolveIn';

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduce
          ? { duration: 0 }
          : { duration: DISSOLVE_DURATION, ease: DISSOLVE_EASE }
      }
    >
      {children}
    </motion.div>
  );
}
