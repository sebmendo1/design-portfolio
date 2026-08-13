/** Portrait phones: device-on-top / text-on-bottom vertical stack. Landscape uses horizontal stack. */
export const CASE_STUDY_PORTRAIT_STACK_QUERY =
  '(max-width: 900px) and (orientation: portrait)';

/**
 * Coarse pointers (phones, tablets, touch laptops). Used for Lenis syncTouch and
 * touch-action CSS — must not be tied to the portrait stack breakpoint, or iPads
 * in the two-column layout lose content scrolling.
 */
export const CASE_STUDY_TOUCH_SCROLL_QUERY = '(pointer: coarse)';

/** True when the device can drive the nested case-study scroller with touch. */
export function caseStudySupportsTouchScroll(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia(CASE_STUDY_TOUCH_SCROLL_QUERY).matches ||
    navigator.maxTouchPoints > 0
  );
}
