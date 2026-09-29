import type { CSSProperties } from 'react';

/** Feed slots (× --reveal-step); header/bio/nav/footer slots live in page CSS. */
export const FIRST_FEED_SLOT = 4;
export const LAST_FEED_SLOT = 6;

export function revealSlot(slot: number): CSSProperties {
  return { '--reveal-slot': slot } as CSSProperties;
}

/** Items past the first few share the last slot so the feed lands as one block. */
export function feedRevealSlot(index: number): number {
  return Math.min(FIRST_FEED_SLOT + index, LAST_FEED_SLOT);
}
