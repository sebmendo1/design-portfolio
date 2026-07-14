import { useLayoutEffect, useRef, useState, type RefObject } from 'react';

/** Progressive width steps (% of container) when a single word sits alone on a line. */
const WIDTH_STEPS = [92, 96, 100] as const;

function hasLonelyLine(container: HTMLElement): boolean {
  const units = container.querySelectorAll<HTMLElement>('.streaming-text__unit--visible');
  if (units.length < 3) return false;

  const lineCounts = new Map<number, number>();
  for (const unit of units) {
    const top = Math.round(unit.getBoundingClientRect().top);
    lineCounts.set(top, (lineCounts.get(top) ?? 0) + 1);
  }

  const counts = [...lineCounts.values()];
  return counts.length > 1 && counts.some((count) => count === 1);
}

export function useLonelyLineWidth(
  containerRef: RefObject<HTMLElement | null>,
  measureKey: number,
): number {
  const [stepIndex, setStepIndex] = useState(0);
  const stepIndexRef = useRef(stepIndex);
  stepIndexRef.current = stepIndex;

  useLayoutEffect(() => {
    if (measureKey < 0) return;

    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      if (stepIndexRef.current >= WIDTH_STEPS.length - 1) return;
      if (!hasLonelyLine(el)) return;
      setStepIndex((prev) => Math.min(prev + 1, WIDTH_STEPS.length - 1));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.parentElement) observer.observe(el.parentElement);

    return () => observer.disconnect();
  }, [containerRef, measureKey, stepIndex]);

  return WIDTH_STEPS[stepIndex];
}
