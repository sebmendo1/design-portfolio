'use client';

import { motion } from 'framer-motion';
import './ScrollHint.css';

type ScrollHintProps = {
  fixed?: boolean;
  onClick?: () => void;
};

export function ScrollHint({ fixed = false, onClick }: ScrollHintProps) {
  return (
    <motion.button
      type="button"
      className={`scroll-hint${fixed ? ' scroll-hint--fixed' : ''}`}
      aria-label="Scroll to continue"
      onClick={onClick}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <span className="scroll-hint__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="12" height="12">
          <path
            d="m4 6 4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </motion.button>
  );
}
