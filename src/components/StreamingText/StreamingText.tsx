'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  splitIntoUnits,
  streamWordDelay,
  WORD_ANIMATION_MS,
  WORD_INTERVAL_MS,
} from '@/lib/streaming-text';
import './StreamingText.css';

export {
  countWords,
  createStreamCursor,
  splitIntoUnits,
  streamDurationMs,
  streamWordDelay,
  WORD_ANIMATION_MS,
  WORD_INTERVAL_MS,
} from '@/lib/streaming-text';

type StreamingTextElement = 'h1' | 'h2' | 'h3' | 'p' | 'span';

type StreamingTextProps = {
  as?: StreamingTextElement;
  text: string;
  className?: string;
  reveal?: boolean;
  /** Show full text immediately without running the stream animation. */
  instant?: boolean;
  /**
   * Where this text's first word sits in the surrounding stream. Segments that
   * share a `totalWords` ride one continuous timeline, so a heading and the
   * items beneath it flow together instead of taking turns.
   */
  startIndex?: number;
  /** Word count of the whole stream. Defaults to this text alone. */
  totalWords?: number;
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
  startIndex = 0,
  totalWords,
  intervalMs = WORD_INTERVAL_MS,
  onComplete,
  'aria-label': ariaLabel,
}: StreamingTextProps) {
  const shouldReduce = useReducedMotion();
  const units = useMemo(() => splitIntoUnits(text), [text]);
  const skipAnimation = instant || !reveal || shouldReduce === true;
  const total = totalWords ?? startIndex + units.length;
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Timing lives entirely in CSS, so the stream runs on the compositor and
  // never re-renders. This only reports when the last word has landed.
  useEffect(() => {
    if (!reveal) return;

    if (skipAnimation || units.length === 0) {
      queueMicrotask(() => onCompleteRef.current?.());
      return;
    }

    const lastStart = streamWordDelay(startIndex + units.length - 1, total, {
      intervalMs,
    });
    const timeoutId = window.setTimeout(
      () => onCompleteRef.current?.(),
      lastStart + WORD_ANIMATION_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [reveal, skipAnimation, units.length, startIndex, total, intervalMs]);

  return (
    <Tag className={className} aria-label={ariaLabel ?? text}>
      {units.map((unit, index) => {
        const delay = skipAnimation
          ? 0
          : streamWordDelay(startIndex + index, total, { intervalMs });

        return (
          <span
            key={index}
            className={
              reveal
                ? skipAnimation
                  ? 'streaming-text__unit streaming-text__unit--instant'
                  : 'streaming-text__unit streaming-text__unit--streaming'
                : 'streaming-text__unit streaming-text__unit--hidden'
            }
            style={{ '--stream-at': `${delay}ms` } as CSSProperties}
          >
            <span className="streaming-text__word">{unit.word}</span>
            {unit.space}
          </span>
        );
      })}
    </Tag>
  );
}
