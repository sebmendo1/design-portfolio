'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import './StreamingText.css';

/** Steady cadence between word reveals, matching ChatGPT's streaming feel. */
export const WORD_INTERVAL_MS = 55;

export const WORD_ANIMATION_MS = 280;

type TextUnit = { word: string; space: string };

/** Split into word + trailing-whitespace units so words animate but spacing stays intact. */
export function splitIntoUnits(text: string): TextUnit[] {
  const units: TextUnit[] = [];
  const regex = /(\S+)(\s*)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    units.push({ word: match[1], space: match[2] });
  }
  return units;
}

export function streamDurationMs(wordCount: number, gapMs = 80): number {
  if (wordCount <= 0) return 0;
  return wordCount * WORD_INTERVAL_MS + WORD_ANIMATION_MS + gapMs;
}

type StreamingTextElement = 'h1' | 'h2' | 'h3' | 'p' | 'span';

type StreamingTextProps = {
  as?: StreamingTextElement;
  text: string;
  className?: string;
  reveal?: boolean;
  startDelayMs?: number;
  onComplete?: () => void;
  'aria-label'?: string;
};

export function StreamingText({
  as: Tag = 'span',
  text,
  className,
  reveal = true,
  startDelayMs = 0,
  onComplete,
  'aria-label': ariaLabel,
}: StreamingTextProps) {
  const shouldReduce = useReducedMotion();
  const units = useMemo(() => splitIntoUnits(text), [text]);
  const [revealedCount, setRevealedCount] = useState(0);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    hasCompletedRef.current = false;

    if (!reveal) return;

    if (shouldReduce) {
      queueMicrotask(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete?.();
        }
      });
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | undefined;
    let count = 0;

    const tick = () => {
      count += 1;
      setRevealedCount(count);
      if (count >= units.length) {
        if (intervalId) clearInterval(intervalId);
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete?.();
        }
      }
    };

    const startTimeoutId = setTimeout(() => {
      if (units.length === 0) {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete?.();
        }
        return;
      }

      setRevealedCount(0);
      tick();
      if (units.length > 1) {
        intervalId = setInterval(tick, WORD_INTERVAL_MS);
      }
    }, startDelayMs);

    return () => {
      clearTimeout(startTimeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [reveal, shouldReduce, units, startDelayMs, onComplete, text]);

  const visibleCount = shouldReduce ? units.length : revealedCount;

  return (
    <Tag className={className} aria-label={ariaLabel ?? text}>
      {units.slice(0, visibleCount).map((unit, index) => (
        <span key={index}>
          <span className="streaming-text__word" aria-hidden="true">
            {unit.word}
          </span>
          {unit.space}
        </span>
      ))}
    </Tag>
  );
}
