/**
 * One shared timeline for every streaming-text surface in the site.
 *
 * Words are scheduled as a single continuous stream rather than line by line:
 * a line never waits for the previous line to finish animating. Each word's
 * entrance is much longer than the gap between words, so dozens overlap at any
 * moment and the text blooms in as one wash instead of a typewriter crawl.
 */

/** Base gap between consecutive word starts. */
export const WORD_INTERVAL_MS = 12;

/** A single word's entrance. Far longer than the interval, so words overlap. */
export const WORD_ANIMATION_MS = 460;

/**
 * Ceiling on the last word's start time. Long documents compress into this
 * budget instead of growing linearly, so adding projects never slows the page.
 */
export const STREAM_MAX_SPAN_MS = 1200;

/**
 * Shapes the cadence. Below 1 the opening words are spaced slightly wider and
 * the tail accelerates, so the stream lands in a rush rather than trailing off.
 */
export const STREAM_RAMP = 0.8;

export type TextUnit = { word: string; space: string };

export type StreamOptions = {
  intervalMs?: number;
  maxSpanMs?: number;
  ramp?: number;
};

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

export function countWords(text: string): number {
  return splitIntoUnits(text).length;
}

/** Total time the stream's word starts span, before any word animation runs. */
export function streamSpanMs(totalWords: number, options: StreamOptions = {}): number {
  const { intervalMs = WORD_INTERVAL_MS, maxSpanMs = STREAM_MAX_SPAN_MS } = options;
  if (totalWords <= 1) return 0;
  return Math.min((totalWords - 1) * intervalMs, maxSpanMs);
}

/**
 * Start time for one word, given its position in the whole stream.
 *
 * This is the single source of truth for cadence: every surface derives its
 * delays from here, so they all share one curve.
 */
export function streamWordDelay(
  index: number,
  totalWords: number,
  options: StreamOptions = {},
): number {
  const { ramp = STREAM_RAMP } = options;
  if (totalWords <= 1 || index <= 0) return 0;

  const span = streamSpanMs(totalWords, options);
  const position = Math.min(index, totalWords - 1) / (totalWords - 1);

  return Math.round(span * Math.pow(position, ramp));
}

/** When the stream is fully painted: last word's start plus its entrance. */
export function streamDurationMs(
  totalWords: number,
  options: StreamOptions = {},
): number {
  if (totalWords <= 0) return 0;
  return streamSpanMs(totalWords, options) + WORD_ANIMATION_MS;
}

/**
 * Walks an ordered list of segments and hands each one its starting word index
 * in the shared stream. Callers keep the offsets and pass them to StreamingText.
 */
export function createStreamCursor() {
  let cursor = 0;

  return {
    /** Reserve `text`'s words and return the offset its first word starts at. */
    take(text: string): number {
      const start = cursor;
      cursor += countWords(text);
      return start;
    },
    /** Reserve a fixed number of words. */
    takeWords(count: number): number {
      const start = cursor;
      cursor += Math.max(0, count);
      return start;
    },
    get total() {
      return cursor;
    },
  };
}
