'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { AnimatedProjectCard } from '@/components/AnimatedProjectCard/AnimatedProjectCard';
import { WorkPageBio } from '@/components/WorkPageBio/WorkPageBio';
import type { ProjectCardSummary } from '@/lib/project-cards';
import { useHorizontalCarouselTouch } from '@/hooks/useHorizontalCarouselTouch';
import './WorkGallery.css';

/** ~480px of horizontal wheel delta before advancing a project. */
const WHEEL_THRESHOLD = 480;

const SNAP_SPRING = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 38,
  restDelta: 0.5,
};

function normalizeWheelDelta(delta: number, deltaMode: number): number {
  if (deltaMode === 1) return delta * 40;
  if (deltaMode === 2) return delta * 500;
  return delta;
}

type WorkGalleryProps = {
  bioText: string;
  projects: ProjectCardSummary[];
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
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const [panelWidth, setPanelWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeIndexRef = useRef(0);
  const wheelAccumRef = useRef(0);

  const scrollX = useMotionValue(0);
  const translateX = useTransform(scrollX, (x) => -x);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const cancelAnimation = useCallback(() => {
    animationRef.current?.stop();
    animationRef.current = null;
  }, []);

  const snapToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(projects.length - 1, index));
      const target = clamped * panelWidthRef.current;

      activeIndexRef.current = clamped;
      setActiveIndex(clamped);

      if (panelWidthRef.current === 0) {
        scrollX.set(target);
        return;
      }

      cancelAnimation();
      animationRef.current = animate(scrollX, target, SNAP_SPRING);
    },
    [cancelAnimation, projects.length, scrollX],
  );

  const { isDragging, touchDraggedRef, isDraggingRef } = useHorizontalCarouselTouch({
    containerRef,
    scrollX,
    panelWidthRef,
    panelCount: projects.length,
    activeIndexRef,
    snapToIndex,
    cancelAnimation,
  });

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

  useEffect(() => {
    if (panelWidth <= 0 || isDraggingRef.current) return;
    scrollX.set(activeIndexRef.current * panelWidth);
  }, [panelWidth, scrollX, isDraggingRef]);

  const advance = useCallback(
    (direction: 1 | -1) => {
      snapToIndex(activeIndexRef.current + direction);
    },
    [snapToIndex],
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const deltaX = normalizeWheelDelta(event.deltaX, event.deltaMode);
      const deltaY = normalizeWheelDelta(event.deltaY, event.deltaMode);

      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

      const atStart = activeIndexRef.current === 0;
      const atEnd = activeIndexRef.current === projects.length - 1;

      if ((atStart && deltaX < 0) || (atEnd && deltaX > 0)) return;

      event.preventDefault();

      if (
        (wheelAccumRef.current > 0 && deltaX < 0) ||
        (wheelAccumRef.current < 0 && deltaX > 0)
      ) {
        wheelAccumRef.current = 0;
      }

      wheelAccumRef.current += deltaX;

      if (Math.abs(wheelAccumRef.current) >= WHEEL_THRESHOLD) {
        wheelAccumRef.current = 0;
        advance(deltaX > 0 ? 1 : -1);
      }
    },
    [advance, projects.length],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        advance(1);
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        advance(-1);
      }
    },
    [advance],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  const handleProjectNavigate = useCallback(
    (href: string) => {
      if (touchDraggedRef.current) return;
      onProjectNavigate?.(href);
    },
    [onProjectNavigate, touchDraggedRef],
  );

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
            <WorkPageBio text={bioText} />
          </div>
        </div>

        <div className="work-gallery__cards-inset">
          <div
            ref={viewportRef}
            className={`work-gallery__viewport${isDragging ? ' work-gallery__viewport--dragging' : ''}`}
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
                      reveal
                      onNavigate={handleProjectNavigate}
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
