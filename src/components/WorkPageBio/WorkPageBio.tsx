'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const CHAR_MIN_MS = 6;
const CHAR_MAX_MS = 52;

/** Ease-out delay: fast at start, slower toward the end. */
function getCharDelay(revealedCount: number, total: number): number {
  if (total <= 1) return CHAR_MIN_MS;
  const progress = revealedCount / (total - 1);
  const eased = 1 - (1 - progress) ** 2;
  return CHAR_MIN_MS + (CHAR_MAX_MS - CHAR_MIN_MS) * eased;
}

type WorkPageBioProps = {
  text: string;
  onComplete?: () => void;
};

export function WorkPageBio({ text, onComplete }: WorkPageBioProps) {
  const shouldReduce = useReducedMotion();
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    if (shouldReduce) return;

    let count = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      count += 1;
      setTypedCount(count);
      if (count < text.length) {
        timeoutId = setTimeout(tick, getCharDelay(count, text.length));
      } else {
        onComplete?.();
      }
    };

    timeoutId = setTimeout(tick, getCharDelay(0, text.length));

    return () => clearTimeout(timeoutId);
  }, [shouldReduce, text, onComplete]);

  useEffect(() => {
    if (shouldReduce) {
      onComplete?.();
    }
  }, [shouldReduce, onComplete]);

  const visibleCount = shouldReduce ? text.length : typedCount;
  const isComplete = visibleCount >= text.length;
  const visibleText = text.slice(0, visibleCount);

  return (
    <div className="work-page__bio">
      <h1 className="work-page__bio-text" aria-label={text}>
        {visibleText}
        {!shouldReduce && !isComplete && (
          <span className="work-page__bio-cursor" aria-hidden="true">
            |
          </span>
        )}
      </h1>
    </div>
  );
}
