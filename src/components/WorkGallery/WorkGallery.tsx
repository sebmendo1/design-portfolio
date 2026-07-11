'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { AnimatedProjectCard } from '@/components/AnimatedProjectCard/AnimatedProjectCard';
import { WorkPageBio } from '@/components/WorkPageBio/WorkPageBio';
import type { Project } from '@/data/projects';
import './WorkGallery.css';

/** ~480px of wheel delta ≈ 3–4 deliberate swipes before advancing a project. */
const WHEEL_THRESHOLD = 480;
/** Minimum vertical swipe distance (px) to advance on touch. */
const TOUCH_THRESHOLD = 96;
const ADVANCE_LOCK_MS = 850;

type WorkGalleryProps = {
  bioText: string;
  projects: Project[];
  onProjectNavigate?: (href: string) => void;
};

export function WorkGallery({
  bioText,
  projects,
  onProjectNavigate,
}: WorkGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const panelWidthRef = useRef(0);
  const [panelWidth, setPanelWidth] = useState(0);
  const [cardsReady, setCardsReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeIndexRef = useRef(0);
  const isLockedRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const wheelAccumRef = useRef(0);

  const targetIndex = useMotionValue(0);
  const smoothIndex = useSpring(targetIndex, {
    stiffness: 320,
    damping: 42,
    restDelta: 0.0001,
  });
  const translateX = useTransform(
    smoothIndex,
    (index) => -index * panelWidthRef.current,
  );

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    targetIndex.set(activeIndex);
  }, [activeIndex, targetIndex]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measure = () => {
      const width = Math.round(viewport.getBoundingClientRect().width);
      panelWidthRef.current = width;
      setPanelWidth(width);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const advance = useCallback(
    (direction: 1 | -1) => {
      if (isLockedRef.current) return;

      setActiveIndex((prev) => {
        const next = prev + direction;
        if (next < 0 || next >= projects.length) return prev;

        isLockedRef.current = true;
        window.setTimeout(() => {
          isLockedRef.current = false;
        }, ADVANCE_LOCK_MS);

        return next;
      });
    },
    [projects.length],
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const atStart = activeIndexRef.current === 0;
      const atEnd = activeIndexRef.current === projects.length - 1;

      if ((atStart && event.deltaY < 0) || (atEnd && event.deltaY > 0)) return;

      event.preventDefault();

      const delta =
        event.deltaMode === 1
          ? event.deltaY * 40
          : event.deltaMode === 2
            ? event.deltaY * 500
            : event.deltaY;

      if (
        (wheelAccumRef.current > 0 && delta < 0) ||
        (wheelAccumRef.current < 0 && delta > 0)
      ) {
        wheelAccumRef.current = 0;
      }

      wheelAccumRef.current += delta;

      if (Math.abs(wheelAccumRef.current) >= WHEEL_THRESHOLD) {
        wheelAccumRef.current = 0;
        advance(delta > 0 ? 1 : -1);
      }
    },
    [advance, projects.length],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowRight' ||
        event.key === ' '
      ) {
        event.preventDefault();
        advance(1);
        return;
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        advance(-1);
      }
    },
    [advance],
  );

  const handleTouchStart = useCallback((event: TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (touchStartY.current === null) return;

      const atStart = activeIndexRef.current === 0;
      const atEnd = activeIndexRef.current === projects.length - 1;
      const delta = touchStartY.current - event.touches[0].clientY;

      if ((atStart && delta < 0) || (atEnd && delta > 0)) return;

      event.preventDefault();
    },
    [projects.length],
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (touchStartY.current === null) return;

      const delta = touchStartY.current - event.changedTouches[0].clientY;
      touchStartY.current = null;

      if (Math.abs(delta) < TOUCH_THRESHOLD) return;

      const swipeUp = delta > 0;
      const atStart = activeIndexRef.current === 0;
      const atEnd = activeIndexRef.current === projects.length - 1;

      if ((atStart && !swipeUp) || (atEnd && swipeUp)) return;

      advance(swipeUp ? 1 : -1);
    },
    [advance, projects.length],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    handleWheel,
    handleKeyDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  const handleBioComplete = useCallback(() => {
    setCardsReady(true);
  }, []);

  const activeProject = projects[activeIndex];

  return (
    <section
      ref={containerRef}
      className="work-gallery__track"
      aria-label="Portfolio projects"
      tabIndex={0}
    >
      <div className="work-gallery__stage">
        <div className="work-gallery__bio-inset">
          <div className="work-gallery__bio">
            <WorkPageBio text={bioText} onComplete={handleBioComplete} />
          </div>
        </div>

        <div className="work-gallery__cards-inset">
          <div
            ref={viewportRef}
            className="work-gallery__viewport"
            style={
              panelWidth > 0
                ? ({ '--panel-width': `${panelWidth}px` } as CSSProperties)
                : undefined
            }
          >
            <motion.div
              className="work-gallery__panels"
              style={{
                x: translateX,
                width: panelWidth > 0 ? panelWidth * projects.length : undefined,
              }}
              aria-live="polite"
              aria-atomic="true"
            >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="work-gallery__panel"
                style={panelWidth > 0 ? { width: panelWidth } : undefined}
                aria-label={`${project.title}${index === activeIndex ? ', current project' : ''}`}
              >
                <div className="work-gallery__panel-inset">
                  <AnimatedProjectCard
                    project={project}
                    index={index}
                    reveal={cardsReady}
                    onNavigate={onProjectNavigate}
                  />
                </div>
              </div>
            ))}
            </motion.div>
          </div>
        </div>
      </div>

      <span className="sr-only">
        {activeProject
          ? `Showing project ${activeIndex + 1} of ${projects.length}: ${activeProject.title}`
          : ''}
      </span>
    </section>
  );
}
