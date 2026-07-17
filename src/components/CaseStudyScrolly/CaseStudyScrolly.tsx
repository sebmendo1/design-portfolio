'use client';

import { useRef, useState, useEffect, useCallback, useMemo, type ReactNode, type RefObject } from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import type { CaseStudyConfig, Beat } from './types';
import {
  splitIntoUnits,
  streamDurationMs,
  StreamingText,
} from '@/components/StreamingText/StreamingText';
import { getVideoPoster } from '@/data/assets';
import { LazyAutoplayVideo } from '@/components/LazyAutoplayVideo/LazyAutoplayVideo';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import { ScrollHint } from '@/components/ScrollHint/ScrollHint';
import './CaseStudyScrolly.css';

/** Trackpad travel (px) that initiates a section change. */
const SCROLL_INITIATE_PX = 80;
/** Pause after section text finishes before the next scroll is accepted. */
const SCROLL_COOLDOWN_MS = 1000;

function beatStreamDurationMs(beat: Beat): number {
  const labelCount = beat.label ? splitIntoUnits(beat.label).length : 0;
  const headlineCount = splitIntoUnits(beat.headline).length;
  const bodyCount = beat.body ? splitIntoUnits(beat.body).length : 0;
  const headlineStart = streamDurationMs(labelCount);
  const bodyStart = headlineStart + streamDurationMs(headlineCount);

  if (bodyCount > 0) {
    return bodyStart + streamDurationMs(bodyCount);
  }
  return headlineStart + streamDurationMs(headlineCount);
}

function outroStreamDurationMs(): number {
  const labelCount = splitIntoUnits('More work').length;
  const headlineStart = streamDurationMs(labelCount);
  return headlineStart + streamDurationMs(splitIntoUnits('See the rest of my projects.').length);
}

function normalizeWheelDelta(deltaY: number, deltaMode: number): number {
  if (deltaMode === 1) return deltaY * 40;
  if (deltaMode === 2) return deltaY * 500;
  return deltaY;
}

// ─── Device frames (static — no animation) ───────────────────────────────────

function BrowserFrame({
  src,
  video,
  url,
  title,
}: {
  src?: string;
  video?: string;
  url?: string;
  title: string;
}) {
  const poster = video ? getVideoPoster(video) : undefined;

  return (
    <div className="cs-browser">
      <div className="cs-browser__chrome">
        <div className="cs-browser__dots">
          <span className="cs-dot cs-dot--red" />
          <span className="cs-dot cs-dot--yellow" />
          <span className="cs-dot cs-dot--green" />
        </div>
        <div className="cs-browser__nav">
          <svg className="cs-browser__nav-icon" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg className="cs-browser__nav-icon" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="cs-browser__url-bar">
          <svg className="cs-browser__lock" viewBox="0 0 12 14" fill="none">
            <rect x="1.5" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4 6V4a2 2 0 0 1 4 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="cs-browser__url-text">{url ?? 'help.salesforce.com'}</span>
        </div>
        <div className="cs-browser__spacer" />
      </div>
      <div className="cs-browser__screen">
        {video ? (
          <LazyAutoplayVideo
            className="cs-device-video"
            src={video}
            poster={poster}
          />
        ) : src ? (
          <OptimizedImage
            src={src}
            alt={`${title} interface screenshot`}
            width={800}
            height={500}
            className="cs-device-img"
            sizes="50vw"
          />
        ) : null}
      </div>
    </div>
  );
}

// ─── Animated text section ────────────────────────────────────────────────────

function TextSection({ beat, smooth, isFirst, isLast, isActive, outroBlend, slot, hasStreamedRef }: {
  beat: Beat;
  smooth: MotionValue<number>;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  outroBlend: MotionValue<number>;
  slot?: ReactNode;
  hasStreamedRef: RefObject<boolean>;
}) {
  const [hasStreamed, setHasStreamed] = useState(() => hasStreamedRef.current);
  const [a, b] = beat.range;
  const fadeSpan = Math.min(0.14, (b - a) * 0.38);
  const fadeIn  = Math.min(a + fadeSpan, b);
  const fadeOut = Math.max(b - fadeSpan, fadeIn);

  const markStreamed = useCallback(() => {
    if (hasStreamedRef.current) return;
    hasStreamedRef.current = true;
    setHasStreamed(true);
  }, [hasStreamedRef]);

  // Last beat holds at full opacity through its range; exits only via outro crossfade
  const rangeOpacity = useTransform(
    smooth,
    isLast
      ? [a, fadeIn, b]
      : [a, fadeIn, fadeOut, b],
    isLast
      ? [isFirst ? 1 : 0, 1, 1]
      : [isFirst ? 1 : 0, 1, 1, 0],
  );
  const opacity = useTransform(
    [rangeOpacity, outroBlend],
    ([range, blend]: number[]) => (isLast ? range * (1 - blend) : range),
  );
  const y = useTransform(
    smooth,
    isLast
      ? [a, fadeIn, b]
      : [a, fadeIn, fadeOut, b],
    isLast
      ? [isFirst ? 0 : 28, 0, 0]
      : [isFirst ? 0 : 28, 0, 0, -28],
  );
  // Sections at opacity 0 are invisible but still block pointer events without this.
  const pointerEvents = useTransform(opacity, (o: number) => (o > 0.05 ? 'auto' : 'none'));

  const labelUnits = useMemo(
    () => (beat.label ? splitIntoUnits(beat.label) : []),
    [beat.label],
  );
  const headlineUnits = useMemo(
    () => splitIntoUnits(beat.headline),
    [beat.headline],
  );
  const headlineDelayMs = streamDurationMs(labelUnits.length);
  const bodyDelayMs = headlineDelayMs + streamDurationMs(headlineUnits.length);
  const showInstant = hasStreamed && isActive;

  return (
    <motion.section className={`cs-section${isFirst ? ' cs-section--hero' : ''}`} style={{ opacity, y, pointerEvents }}>
      {beat.label && (
        <StreamingText
          as="p"
          className="cs-section__label"
          text={beat.label}
          reveal={isActive}
          instant={showInstant}
        />
      )}
      <StreamingText
        as={isFirst ? 'h1' : 'h2'}
        className="cs-section__headline"
        text={beat.headline}
        reveal={isActive}
        instant={showInstant}
        startDelayMs={headlineDelayMs}
        onComplete={beat.body ? undefined : markStreamed}
      />
      {beat.body && (
        <StreamingText
          as="p"
          className="cs-section__body"
          text={beat.body}
          reveal={isActive}
          instant={showInstant}
          startDelayMs={bodyDelayMs}
          onComplete={markStreamed}
        />
      )}
      {isFirst && slot && <div className="cs-section__slot">{slot}</div>}
    </motion.section>
  );
}

// ─── Home navigation (dissolve exit when provided) ────────────────────────────

function HomeLink({
  className,
  children,
  onHomeNavigate,
}: {
  className: string;
  children: ReactNode;
  onHomeNavigate?: (href: string) => void;
}) {
  return (
    <Link
      href="/"
      className={className}
      onClick={(event) => {
        if (!onHomeNavigate) return;
        event.preventDefault();
        onHomeNavigate('/');
      }}
    >
      {children}
    </Link>
  );
}

// ─── Outro: crossfades in as smooth progresses from last beat to 1.0 ────────

function OutroSection({
  outroBlend,
  isActive,
  hasStreamedRef,
  onHomeNavigate,
}: {
  outroBlend: MotionValue<number>;
  isActive: boolean;
  hasStreamedRef: RefObject<boolean>;
  onHomeNavigate?: (href: string) => void;
}) {
  const [hasStreamed, setHasStreamed] = useState(() => hasStreamedRef.current);
  const opacity       = outroBlend;
  const y             = useTransform(outroBlend, [0, 1], [16, 0]);
  const pointerEvents = useTransform(opacity, (o: number) => (o > 0.05 ? 'auto' : 'none'));
  const labelDelayMs = streamDurationMs(splitIntoUnits('More work').length);
  const showInstant = hasStreamed && isActive;

  const markStreamed = useCallback(() => {
    if (hasStreamedRef.current) return;
    hasStreamedRef.current = true;
    setHasStreamed(true);
  }, [hasStreamedRef]);

  return (
    <motion.section className="cs-section cs-section--outro" style={{ opacity, y, pointerEvents }}>
      <StreamingText
        as="p"
        className="cs-section__label"
        text="More work"
        reveal={isActive}
        instant={showInstant}
      />
      <StreamingText
        as="h2"
        className="cs-section__headline"
        text="See the rest of my projects."
        reveal={isActive}
        instant={showInstant}
        startDelayMs={labelDelayMs}
        onComplete={markStreamed}
      />
      <div className="cs-section__slot">
        <HomeLink className="cs-outro__btn" onHomeNavigate={onHomeNavigate}>
          View all projects
        </HomeLink>
      </div>
    </motion.section>
  );
}

// ─── Reduced-motion fallback ──────────────────────────────────────────────────

function StaticFallback({
  config,
  slot,
  onHomeNavigate,
}: {
  config: CaseStudyConfig;
  slot?: ReactNode;
  onHomeNavigate?: (href: string) => void;
}) {
  const { frame, src, video, url, screenAspectRatio } = config.stage.centerpiece;
  const title = config.title;
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const onScroll = () => setShowScrollHint(window.scrollY < 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToNext = () => {
    window.scrollBy({ top: window.innerHeight * 0.45, behavior: 'smooth' });
  };

  return (
    <article className="cs-article" aria-label={config.title}>
      <div className="cs-layout cs-layout--static">
      <div className="cs-text-col cs-text-col--static">
        {config.beats.map((beat, i) => (
          <section key={beat.id} className={`cs-section cs-section--static${i === 0 ? ' cs-section--hero' : ''}`}>
            {beat.label && <p className="cs-section__label">{beat.label}</p>}
            {i === 0 ? (
              <h1 className="cs-section__headline">{beat.headline}</h1>
            ) : (
              <h2 className="cs-section__headline">{beat.headline}</h2>
            )}
            {beat.body && <p className="cs-section__body">{beat.body}</p>}
            {i === 0 && slot && <div className="cs-section__slot">{slot}</div>}
          </section>
        ))}
        <section className="cs-section cs-section--static cs-section--outro-static">
          <p className="cs-section__label">More work</p>
          <h2 className="cs-section__headline">See the rest of my projects.</h2>
          <div className="cs-section__slot">
            <HomeLink className="cs-outro__btn" onHomeNavigate={onHomeNavigate}>
              View all projects
            </HomeLink>
          </div>
        </section>
      </div>
      <div className="cs-visual-col">
        <div className="cs-sticky">
          <div className="cs-device-card">
            {frame === 'browser' && (
              <BrowserFrame src={src} video={video} url={url} title={title} />
            )}
            {frame === 'phone' && (
              <PhoneStencil
                src={src}
                video={video}
                poster={video ? getVideoPoster(video) : undefined}
                alt={`${title} app screenshot`}
                screenAspectRatio={screenAspectRatio}
                variant="case-study"
              />
            )}
            {frame === 'none' && src && (
              <OptimizedImage
                src={src}
                alt={`${title} product screenshot`}
                width={400}
                height={400}
                className="cs-device-standalone-img"
                sizes="100vw"
              />
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showScrollHint && <ScrollHint fixed onClick={scrollToNext} />}
      </AnimatePresence>
      </div>
    </article>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CaseStudyScrolly({
  config,
  slot,
  onHomeNavigate,
}: {
  config: CaseStudyConfig;
  slot?: ReactNode;
  onHomeNavigate?: (href: string) => void;
}) {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const snapTargets = useMemo(
    () => [...config.beats.map((beat) => (beat.range[0] + beat.range[1]) / 2), 1],
    [config.beats],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const scrollLockedRef = useRef(true);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTouchYRef = useRef<number | null>(null);
  const sectionStreamedRefs = useRef(
    Array.from({ length: config.beats.length + 1 }, () => ({ current: false })),
  );

  const targetProgress = useMotionValue(snapTargets[0]);
  const smooth = useSpring(targetProgress, {
    stiffness: 240,
    damping: 34,
    mass: 0.75,
    restDelta: 0.0005,
  });
  const lastBeatTarget = snapTargets[snapTargets.length - 2] ?? 0.9;
  const outroBlend = useTransform(smooth, [lastBeatTarget, 1], [0, 1]);

  const cancelScrollUnlock = useCallback(() => {
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }, []);

  const scheduleScrollUnlock = useCallback(
    (sectionIndex: number) => {
      scrollLockedRef.current = true;
      cancelScrollUnlock();

      const alreadyStreamed = sectionStreamedRefs.current[sectionIndex]?.current ?? false;
      const streamMs = shouldReduce || alreadyStreamed
        ? 0
        : sectionIndex < config.beats.length
          ? beatStreamDurationMs(config.beats[sectionIndex])
          : outroStreamDurationMs();

      unlockTimerRef.current = setTimeout(() => {
        scrollLockedRef.current = false;
      }, streamMs + SCROLL_COOLDOWN_MS);
    },
    [cancelScrollUnlock, config.beats, shouldReduce],
  );

  const snapToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(snapTargets.length - 1, index));
      if (clamped === activeIndexRef.current) {
        wheelAccumRef.current = 0;
        return;
      }

      scrollLockedRef.current = true;
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
      wheelAccumRef.current = 0;
      targetProgress.set(snapTargets[clamped]);
      scheduleScrollUnlock(clamped);
    },
    [scheduleScrollUnlock, snapTargets, targetProgress],
  );

  const applyScrollDelta = useCallback(
    (delta: number) => {
      if (scrollLockedRef.current) return false;

      const index = activeIndexRef.current;
      const atStart = index === 0 && delta < 0;
      const atEnd = index === snapTargets.length - 1 && delta > 0;
      if (atStart || atEnd) return false;

      if (
        (wheelAccumRef.current > 0 && delta < 0)
        || (wheelAccumRef.current < 0 && delta > 0)
      ) {
        wheelAccumRef.current = 0;
      }

      wheelAccumRef.current += delta;

      if (Math.abs(wheelAccumRef.current) >= SCROLL_INITIATE_PX) {
        scrollLockedRef.current = true;
        const direction = wheelAccumRef.current > 0 ? 1 : -1;
        snapToIndex(index + direction);
        return true;
      }

      return true;
    },
    [snapTargets.length, snapToIndex],
  );

  const nudgeProgress = useCallback(
    (direction: 1 | -1) => {
      if (scrollLockedRef.current) return;
      wheelAccumRef.current = 0;
      snapToIndex(activeIndexRef.current + direction);
    },
    [snapToIndex],
  );

  useEffect(() => {
    scheduleScrollUnlock(0);
    return cancelScrollUnlock;
  }, [cancelScrollUnlock, scheduleScrollUnlock]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const delta = normalizeWheelDelta(e.deltaY, e.deltaMode);
      const index = activeIndexRef.current;
      const atStart = index === 0 && delta < 0;
      const atEnd = index === snapTargets.length - 1 && delta > 0;
      if (atStart || atEnd) return;

      if (scrollLockedRef.current) {
        e.preventDefault();
        return;
      }

      if (applyScrollDelta(delta)) {
        e.preventDefault();
      }
    },
    [applyScrollDelta, snapTargets.length],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        nudgeProgress(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nudgeProgress(-1);
      }
    },
    [nudgeProgress],
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    lastTouchYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (lastTouchYRef.current === null) return;

      const y = e.touches[0].clientY;
      const delta = lastTouchYRef.current - y;
      lastTouchYRef.current = y;

      const index = activeIndexRef.current;
      const atStart = index === 0 && delta < 0;
      const atEnd = index === snapTargets.length - 1 && delta > 0;
      if (atStart || atEnd) return;

      if (scrollLockedRef.current) {
        e.preventDefault();
        return;
      }

      if (applyScrollDelta(delta)) {
        e.preventDefault();
      }
    },
    [applyScrollDelta, snapTargets.length],
  );

  const handleTouchEnd = useCallback(() => {
    lastTouchYRef.current = null;
    if (!scrollLockedRef.current) {
      wheelAccumRef.current = 0;
    }
  }, []);

  useEffect(() => {
    if (shouldReduce) return;
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel',      handleWheel,      { passive: false });
    el.addEventListener('keydown',    handleKeyDown);
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove',  handleTouchMove,  { passive: false });
    el.addEventListener('touchend',   handleTouchEnd,   { passive: true });
    return () => {
      cancelScrollUnlock();
      el.removeEventListener('wheel',      handleWheel);
      el.removeEventListener('keydown',    handleKeyDown);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove',  handleTouchMove);
      el.removeEventListener('touchend',   handleTouchEnd);
    };
  }, [shouldReduce, handleWheel, handleKeyDown, handleTouchStart, handleTouchMove, handleTouchEnd, cancelScrollUnlock]);

  const { frame, src, video, url, screenAspectRatio } = config.stage.centerpiece;
  const title = config.title;

  if (shouldReduce) {
    return <StaticFallback config={config} slot={slot} onHomeNavigate={onHomeNavigate} />;
  }

  return (
    <article className="cs-article" aria-label={config.title}>
      <div
        ref={containerRef}
        className="cs-track"
        tabIndex={0}
        aria-label="Case study navigation"
      >
      <div className="cs-layout">
        {/* Left: sticky panel with crossfading text sections */}
        <div className="cs-text-col">
          {config.beats.map((beat, i) => (
            <TextSection
              key={beat.id}
              beat={beat}
              smooth={smooth}
              isFirst={i === 0}
              isLast={i === config.beats.length - 1}
              isActive={activeIndex === i}
              outroBlend={outroBlend}
              slot={slot}
              hasStreamedRef={sectionStreamedRefs.current[i]}
            />
          ))}
          <OutroSection
            outroBlend={outroBlend}
            isActive={activeIndex === config.beats.length}
            hasStreamedRef={sectionStreamedRefs.current[config.beats.length]}
            onHomeNavigate={onHomeNavigate}
          />
        </div>

        {/* Right: device frame — no animation, just static inside card */}
        <div className="cs-visual-col">
          {/* Floating back button — only visible on mobile (hidden via CSS on desktop) */}
          <HomeLink className="cs-mobile-back" onHomeNavigate={onHomeNavigate}>
            ← Back
          </HomeLink>
          <div className="cs-device-card">
            {frame === 'browser' && (
              <BrowserFrame src={src} video={video} url={url} title={title} />
            )}
            {frame === 'phone' && (
              <PhoneStencil
                src={src}
                video={video}
                poster={video ? getVideoPoster(video) : undefined}
                alt={`${title} app screenshot`}
                screenAspectRatio={screenAspectRatio}
                variant="case-study"
              />
            )}
            {frame === 'none' && src && (
              <OptimizedImage
                src={src}
                alt={`${title} product screenshot`}
                width={400}
                height={400}
                className="cs-device-standalone-img"
                sizes="50vw"
              />
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {activeIndex === 0 && (
          <ScrollHint onClick={() => nudgeProgress(1)} />
        )}
      </AnimatePresence>
      </div>
    </article>
  );
}
