'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const CHAR_MS = 15;

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
        timeoutId = setTimeout(tick, CHAR_MS);
      } else {
        onComplete?.();
      }
    };

    timeoutId = setTimeout(tick, CHAR_MS);

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
