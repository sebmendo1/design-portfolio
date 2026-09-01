/** Steady cadence between word reveals, matching ChatGPT's streaming feel. */
export const WORD_INTERVAL_MS = 55;

export const WORD_ANIMATION_MS = 280;

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

export function streamDurationMs(wordCount: number, gapMs = 80): number {
  if (wordCount <= 0) return 0;
  return wordCount * WORD_INTERVAL_MS + WORD_ANIMATION_MS + gapMs;
}
