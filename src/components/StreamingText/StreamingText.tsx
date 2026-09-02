'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { splitIntoUnits, WORD_INTERVAL_MS } from '@/lib/streaming-text';
import './StreamingText.css';

export {
  splitIntoUnits,
  streamDurationMs,
  WORD_ANIMATION_MS,
  WORD_INTERVAL_MS,
} from '@/lib/streaming-text';

type StreamingTextElement = 'h1' | 'h2' | 'h3' | 'p' | 'span';

type StreamingTextProps = {
  as?: StreamingTextElement;
  text: string;
  className?: string;
  reveal?: boolean;
  /** Show full text immediately without re-running the stream animation. */
  instant?: boolean;
  startDelayMs?: number;
  intervalMs?: number;
  onComplete?: () => void;
  'aria-label'?: string;
};

export function StreamingText({
  as: Tag = 'span',
  text,
  className,
  reveal = true,
  instant = false,
  startDelayMs = 0,
  intervalMs = WORD_INTERVAL_MS,
  onComplete,
  'aria-label': ariaLabel,
}: StreamingTextProps) {
  const shouldReduce = useReducedMotion();
  const units = useMemo(() => splitIntoUnits(text), [text]);
  const skipAnimation = instant || !reveal || shouldReduce;
  const [revealedCount, setRevealedCount] = useState(0);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    hasCompletedRef.current = false;

    if (skipAnimation) {
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
        intervalId = setInterval(tick, intervalMs);
      }
    }, startDelayMs);

    return () => {
      clearTimeout(startTimeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [instant, skipAnimation, units, startDelayMs, intervalMs, onComplete, text]);

  const visibleCount = !reveal ? 0 : skipAnimation ? units.length : revealedCount;

  return (
    <Tag className={className} aria-label={ariaLabel ?? text}>
      {units.map((unit, index) => (
        <span
          key={index}
          className={
            index < visibleCount
              ? 'streaming-text__unit streaming-text__unit--visible'
              : 'streaming-text__unit streaming-text__unit--pending'
          }
        >
          <span className="streaming-text__word">{unit.word}</span>
          {unit.space}
        </span>
      ))}
    </Tag>
  );
}
