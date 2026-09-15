/** Steady cadence between word reveals, matching ChatGPT's streaming feel. */
export const WORD_INTERVAL_MS = 28;

export const WORD_ANIMATION_MS = 140;

/** Pause after a line finishes so the next line does not start mid-animation. */
export const STREAM_LINE_GAP_MS = 80;

export type TextUnit = { word: string; space: string };

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

/** Time from a line's first word until its last word animation completes. */
export function streamLineEndMs(
  wordCount: number,
  intervalMs: number = WORD_INTERVAL_MS,
): number {
  if (wordCount <= 0) return 0;
  return Math.max(0, wordCount - 1) * intervalMs + WORD_ANIMATION_MS;
}

export function streamDurationMs(
  wordCount: number,
  gapMs = STREAM_LINE_GAP_MS,
  intervalMs: number = WORD_INTERVAL_MS,
): number {
  if (wordCount <= 0) return 0;
  return streamLineEndMs(wordCount, intervalMs) + gapMs;
}
