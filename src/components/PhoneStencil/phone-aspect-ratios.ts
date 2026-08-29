/**
 * iPhone 15 Pro logical chrome — used by every PhoneStencil frame.
 * Screen: 393 × 852 pt. Display corner radius: 55 pt (continuous).
 * Dynamic Island hardware: 125 × 36 pt, 11.5 pt from the top of the display.
 * Home indicator: 134 × 5 pt, 8 pt from the bottom of the display.
 * Titanium lip: 9.5 pt per side.
 *
 * Media aspect ratios below are for source files only. The device frame
 * always uses DEFAULT_PHONE_SCREEN_AR so every phone is the same height.
 */

/** iPhone 15 Pro display width (logical pt) */
export const PHONE_BODY_WIDTH = 393;

/** Bezel inset per side at reference size (pt) */
export const PHONE_BEZEL_PT = 9.5;

/** Side button width at reference size (pt) */
export const PHONE_BUTTON_WIDTH_PT = 3;

/** Bezel as fraction of display width (9.5/393) */
export const BEZEL_RATIO = PHONE_BEZEL_PT / PHONE_BODY_WIDTH;

/** Side button width as fraction of display width */
export const BUTTON_WIDTH_RATIO = PHONE_BUTTON_WIDTH_PT / PHONE_BODY_WIDTH;

/** Outer body width ≈ screen width × this factor (1 + 2× bezel) */
export const BODY_PADDING_SCALE = 1 + 2 * BEZEL_RATIO;

/** iPhone 15 Pro display — 393 × 852 */
export const DEFAULT_PHONE_SCREEN_AR = 393 / 852;

export const PHONE_SCREEN_AR = {
  mementoDemo: 750 / 1630,
  caseyRcs: 750 / 1638,
  chaseMyHomeDemo: 852 / 1848,
  mementoPreview: 786 / 1748,
  caseyPreview: 786 / 1748,
  chasePreview: 786 / 1745,
  agenticPreview: 786 / 1748,
} as const;
