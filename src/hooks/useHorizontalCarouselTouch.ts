import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { MotionValue } from 'framer-motion';

const TAP_SLOP = 10;
const DRAG_SNAP_RATIO = 0.28;
const FLICK_VELOCITY = 0.45;
const RUBBER_BAND = 0.35;
const HORIZONTAL_LOCK_SLOP = 8;

type VelocitySample = { x: number; t: number };

function rubberBandScroll(scroll: number, min: number, max: number): number {
  if (scroll < min) return min - (min - scroll) * RUBBER_BAND;
  if (scroll > max) return max + (scroll - max) * RUBBER_BAND;
  return scroll;
}

function fingerVelocity(samples: VelocitySample[]): number {
  if (samples.length < 2) return 0;

  const first = samples[0];
  const last = samples[samples.length - 1];
  const dt = last.t - first.t;

  if (dt <= 0) return 0;
  return (last.x - first.x) / dt;
}

type UseHorizontalCarouselTouchOptions = {
  containerRef: RefObject<HTMLElement | null>;
  scrollX: MotionValue<number>;
  panelWidthRef: RefObject<number>;
  panelCount: number;
  activeIndexRef: RefObject<number>;
  snapToIndex: (index: number) => void;
  cancelAnimation: () => void;
};

export function useHorizontalCarouselTouch({
  containerRef,
  scrollX,
  panelWidthRef,
  panelCount,
  activeIndexRef,
  snapToIndex,
  cancelAnimation,
}: UseHorizontalCarouselTouchOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const touchDraggedRef = useRef(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const startScrollX = useRef(0);
  const horizontalLocked = useRef(false);
  const velocitySamples = useRef<VelocitySample[]>([]);
  const isDraggingRef = useRef(false);

  const resetTouch = useCallback(() => {
    touchStartX.current = null;
    touchStartY.current = null;
    horizontalLocked.current = false;
    velocitySamples.current = [];
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const resolveSnapIndex = useCallback(
    (currentScroll: number, velocity: number) => {
      const width = panelWidthRef.current;
      const baseIndex = activeIndexRef.current;
      if (width <= 0) return baseIndex;

      const deltaFromBase = currentScroll - baseIndex * width;
      let targetIndex = baseIndex;

      if (velocity < -FLICK_VELOCITY) {
        targetIndex = baseIndex + 1;
      } else if (velocity > FLICK_VELOCITY) {
        targetIndex = baseIndex - 1;
      } else if (deltaFromBase > width * DRAG_SNAP_RATIO) {
        targetIndex = baseIndex + 1;
      } else if (deltaFromBase < -width * DRAG_SNAP_RATIO) {
        targetIndex = baseIndex - 1;
      }

      return Math.max(0, Math.min(panelCount - 1, targetIndex));
    },
    [activeIndexRef, panelCount, panelWidthRef],
  );

  const finishTouch = useCallback(
    (clientX: number) => {
      if (!horizontalLocked.current) {
        resetTouch();
        return;
      }

      const velocity = fingerVelocity(velocitySamples.current);
      const targetIndex = resolveSnapIndex(scrollX.get(), velocity);

      if (touchStartX.current !== null && Math.abs(touchStartX.current - clientX) > TAP_SLOP) {
        touchDraggedRef.current = true;
      }

      snapToIndex(targetIndex);
      resetTouch();
    },
    [resetTouch, resolveSnapIndex, scrollX, snapToIndex],
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      cancelAnimation();
      touchDraggedRef.current = false;

      const touch = event.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      startScrollX.current = scrollX.get();
      horizontalLocked.current = false;
      velocitySamples.current = [{ x: touch.clientX, t: event.timeStamp }];
      isDraggingRef.current = false;
    },
    [cancelAnimation, scrollX],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const touch = event.touches[0];
      const deltaX = touchStartX.current - touch.clientX;
      const deltaY = touchStartY.current - touch.clientY;

      if (!horizontalLocked.current) {
        if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < HORIZONTAL_LOCK_SLOP) return;

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          resetTouch();
          return;
        }

        horizontalLocked.current = true;
        isDraggingRef.current = true;
        setIsDragging(true);
      }

      event.preventDefault();

      const width = panelWidthRef.current;
      const maxScroll = Math.max(0, (panelCount - 1) * width);
      const rawScroll = startScrollX.current + deltaX;
      scrollX.set(rubberBandScroll(rawScroll, 0, maxScroll));

      if (Math.abs(deltaX) > TAP_SLOP) {
        touchDraggedRef.current = true;
      }

      velocitySamples.current.push({ x: touch.clientX, t: event.timeStamp });
      if (velocitySamples.current.length > 6) {
        velocitySamples.current.shift();
      }
    },
    [panelCount, panelWidthRef, resetTouch, scrollX],
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (touchStartX.current === null) return;
      finishTouch(event.changedTouches[0].clientX);
    },
    [finishTouch],
  );

  const handleTouchCancel = useCallback(
    (event: TouchEvent) => {
      if (touchStartX.current === null) return;
      finishTouch(event.changedTouches[0]?.clientX ?? touchStartX.current);
    },
    [finishTouch],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [
    containerRef,
    handleTouchCancel,
    handleTouchEnd,
    handleTouchMove,
    handleTouchStart,
  ]);

  return { isDragging, touchDraggedRef, isDraggingRef };
}
