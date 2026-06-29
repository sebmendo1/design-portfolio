/**
 * Measured media dimensions (ffprobe / file inspect, 2026-06).
 * Posters: casey 750×1638, memento 750×1630, chase 852×1848
 * Card PNGs: 786×1748 (memento, casey, agentic), chase 786×1745
 * Reference device: iPhone 15 Pro — body 393×874pt, screen ~375×812pt
 */

/** iPhone 15 Pro body reference width (logical pt) */
export const PHONE_BODY_WIDTH = 393;

/** Bezel inset per side at reference size (9pt) */
export const PHONE_BEZEL_PT = 9;

/** Side button width at reference size (3pt) */
export const PHONE_BUTTON_WIDTH_PT = 3;

/** Bezel as fraction of body width (9/393 ≈ 0.0229) */
export const BEZEL_RATIO = PHONE_BEZEL_PT / PHONE_BODY_WIDTH;

/** Side button width as fraction of body width (3/393 ≈ 0.00764) */
export const BUTTON_WIDTH_RATIO = PHONE_BUTTON_WIDTH_PT / PHONE_BODY_WIDTH;

/** Outer body width ≈ screen width × this factor (1 + 2× bezel) */
export const BODY_PADDING_SCALE = 1 + 2 * BEZEL_RATIO;

export const DEFAULT_PHONE_SCREEN_AR = 375 / 812;

export const PHONE_SCREEN_AR = {
  mementoDemo: 750 / 1630,
  caseyRcs: 750 / 1638,
  chaseMyHomeDemo: 852 / 1848,
  mementoPreview: 786 / 1748,
  caseyPreview: 786 / 1748,
  chasePreview: 786 / 1745,
  agenticPreview: 786 / 1748,
} as const;
