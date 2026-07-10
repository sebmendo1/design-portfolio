'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Steady cadence between word reveals, matching ChatGPT's streaming feel. */
const WORD_INTERVAL_MS = 55;

type WorkPageBioProps = {
  text: string;
  onComplete?: () => void;
};

/** Split into word + trailing-whitespace units so words animate but spacing stays intact. */
function splitIntoUnits(text: string): { word: string; space: string }[] {
  const units: { word: string; space: string }[] = [];
  const regex = /(\S+)(\s*)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    units.push({ word: match[1], space: match[2] });
  }
  return units;
}

export function WorkPageBio({ text, onComplete }: WorkPageBioProps) {
  const shouldReduce = useReducedMotion();
  const units = useMemo(() => splitIntoUnits(text), [text]);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (shouldReduce) {
      onComplete?.();
      return;
    }

    let count = 0;
    const intervalId = setInterval(() => {
      count += 1;
      setRevealedCount(count);
      if (count >= units.length) {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, WORD_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [shouldReduce, units, onComplete]);

  const visibleCount = shouldReduce ? units.length : revealedCount;

  return (
    <div className="work-page__bio">
      <h1 className="work-page__bio-text" aria-label={text}>
        {units.slice(0, visibleCount).map((unit, index) => (
          <span key={index}>
            <span className="work-page__bio-word" aria-hidden="true">
              {unit.word}
            </span>
            {unit.space}
          </span>
        ))}
      </h1>
    </div>
  );
}
