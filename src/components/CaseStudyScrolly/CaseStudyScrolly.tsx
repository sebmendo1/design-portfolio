'use client';

import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import type { CaseStudyConfig, Beat } from './types';
import './CaseStudyScrolly.css';

// ─── Device frames (static — no animation) ───────────────────────────────────

function BrowserFrame({ src, video, url }: { width: number; src?: string; video?: string; url?: string }) {
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
          <video
            className="cs-device-video"
            src={video}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
          />
        ) : src ? (
          <img src={src} alt="" className="cs-device-img" loading="lazy" />
        ) : null}
      </div>
    </div>
  );
}

function PhoneFrame({ src, video }: { width: number; src?: string; video?: string }) {
  return (
    <div className="cs-phone">
      <div className="cs-phone__btn cs-phone__btn--action" />
      <div className="cs-phone__btn cs-phone__btn--vol-up" />
      <div className="cs-phone__btn cs-phone__btn--vol-down" />
      <div className="cs-phone__btn cs-phone__btn--power" />
      <div className="cs-phone__screen">
        <div className="cs-phone__island" />
        {video ? (
          <video
            className="cs-device-video"
            src={video}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
          />
        ) : src ? (
          <img src={src} alt="" className="cs-device-img" loading="lazy" />
        ) : (
          <div className="cs-phone__screen-fill" />
        )}
      </div>
    </div>
  );
}

// ─── Animated text section ────────────────────────────────────────────────────

function TextSection({ beat, smooth, isFirst, slot }: {
  beat: Beat;
  smooth: MotionValue<number>;
  isFirst: boolean;
  slot?: ReactNode;
}) {
  const [a, b] = beat.range;
  const fadeIn  = Math.min(a + 0.07, b);
  const fadeOut = Math.max(b - 0.07, fadeIn);

  // First beat is visible from progress 0; all others fade in from their range start
  const opacity = useTransform(
    smooth,
    [a,             fadeIn, fadeOut, b],
    [isFirst ? 1 : 0, 1,    1,      0],
  );
  const y = useTransform(
    smooth,
    [a,              fadeIn, fadeOut, b],
    [isFirst ? 0 : 20, 0,    0,     -20],
  );
  // Sections at opacity 0 are invisible but still block pointer events without this.
  const pointerEvents = useTransform(opacity, (o: number) => (o > 0.05 ? 'auto' : 'none'));

  return (
    <motion.section className={`cs-section${isFirst ? ' cs-section--hero' : ''}`} style={{ opacity, y, pointerEvents }}>
      {beat.label && <p className="cs-section__label">{beat.label}</p>}
      <h2 className="cs-section__headline">{beat.headline}</h2>
      {beat.body && <p className="cs-section__body">{beat.body}</p>}
      {isFirst && slot && <div className="cs-section__slot">{slot}</div>}
    </motion.section>
  );
}

// ─── Outro: fades in over the last ~12% of the scroll track ─────────────────

function OutroSection({ smooth }: { smooth: MotionValue<number> }) {
  const opacity       = useTransform(smooth, [0.88, 0.96], [0, 1]);
  const y             = useTransform(smooth, [0.88, 0.96], [16, 0]);
  const pointerEvents = useTransform(opacity, (o: number) => (o > 0.05 ? 'auto' : 'none'));

  return (
    <motion.section className="cs-section cs-section--outro" style={{ opacity, y, pointerEvents }}>
      <p className="cs-section__label">More work</p>
      <h2 className="cs-section__headline">See the rest of my projects.</h2>
      <div className="cs-section__slot">
        <Link href="/" className="cs-outro__btn">View all projects</Link>
      </div>
    </motion.section>
  );
}

// ─── Reduced-motion fallback ──────────────────────────────────────────────────

function StaticFallback({ config, slot }: { config: CaseStudyConfig; slot?: ReactNode }) {
  const { frame, width, src, video, url } = config.stage.centerpiece;
  return (
    <div className="cs-layout cs-layout--static">
      <div className="cs-text-col cs-text-col--static">
        {config.beats.map((beat, i) => (
          <section key={beat.id} className={`cs-section cs-section--static${i === 0 ? ' cs-section--hero' : ''}`}>
            {beat.label && <p className="cs-section__label">{beat.label}</p>}
            <h2 className="cs-section__headline">{beat.headline}</h2>
            {beat.body && <p className="cs-section__body">{beat.body}</p>}
            {i === 0 && slot && <div className="cs-section__slot">{slot}</div>}
          </section>
        ))}
        <section className="cs-section cs-section--static cs-section--outro-static">
          <p className="cs-section__label">More work</p>
          <h2 className="cs-section__headline">See the rest of my projects.</h2>
          <div className="cs-section__slot">
            <Link href="/" className="cs-outro__btn">View all projects</Link>
          </div>
        </section>
      </div>
      <div className="cs-visual-col">
        <div className="cs-sticky">
          <div className="cs-device-card">
            {frame === 'browser' && <BrowserFrame width={width} src={src} video={video} url={url} />}
            {frame === 'phone'   && <PhoneFrame   width={width} src={src} video={video} />}
            {frame === 'none' && src && (
              <img src={src} alt="" className="cs-device-standalone-img" loading="lazy" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CaseStudyScrolly({ config, slot }: { config: CaseStudyConfig; slot?: ReactNode }) {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Beat midpoints — the progress value that places each beat fully in view
  const beatTargets = config.beats.map(b => (b.range[0] + b.range[1]) / 2);

  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const activeBeatIndexRef = useRef(0);       // mirror for event handlers (avoids stale closure)
  const isLockedRef        = useRef(false);   // block events during spring animation
  const touchStartY        = useRef<number | null>(null);
  const wheelAccumRef      = useRef(0);       // accumulated pixel delta — beat advances at threshold

  const targetProgress = useMotionValue(0);
  const smooth = useSpring(targetProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Keep ref in sync with state so event handlers always read the current index
  useEffect(() => { activeBeatIndexRef.current = activeBeatIndex; }, [activeBeatIndex]);

  // Push new target into the MotionValue; spring animates toward it
  useEffect(() => {
    const t = activeBeatIndex < config.beats.length
      ? beatTargets[activeBeatIndex]
      : 1.0;
    targetProgress.set(t);
  // beatTargets is derived from config.beats which doesn't change; safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBeatIndex]);

  const advanceBeat = useCallback((direction: 1 | -1) => {
    if (isLockedRef.current) return;
    setActiveBeatIndex(prev => {
      const next = prev + direction;
      if (next < 0 || next > config.beats.length) return prev;
      isLockedRef.current = true;
      setTimeout(() => { isLockedRef.current = false; }, 700);
      return next;
    });
  }, [config.beats.length]);

  const handleWheel = useCallback((e: WheelEvent) => {
    const atStart = activeBeatIndexRef.current === 0;
    const atEnd   = activeBeatIndexRef.current === config.beats.length;
    if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) return;
    e.preventDefault();

    // Normalise deltaMode so line/page wheels map to approximate pixel values
    const delta = e.deltaMode === 1 ? e.deltaY * 40
                : e.deltaMode === 2 ? e.deltaY * 500
                : e.deltaY;

    // Reset accumulator on direction reversal
    if ((wheelAccumRef.current > 0 && delta < 0) || (wheelAccumRef.current < 0 && delta > 0)) {
      wheelAccumRef.current = 0;
    }
    wheelAccumRef.current += delta;

    // ~250px equivalent = 1.5–2 deliberate swipes / 2 mouse-wheel clicks before advancing
    if (Math.abs(wheelAccumRef.current) >= 250) {
      wheelAccumRef.current = 0;
      advanceBeat(delta > 0 ? 1 : -1);
    }
  }, [advanceBeat, config.beats.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); advanceBeat(1); }
    else if (e.key === 'ArrowUp')               { e.preventDefault(); advanceBeat(-1); }
  }, [advanceBeat]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;
    if (Math.abs(delta) < 40) return;
    const swipeUp = delta > 0;
    const atStart = activeBeatIndexRef.current === 0;
    const atEnd   = activeBeatIndexRef.current === config.beats.length;
    if ((atStart && !swipeUp) || (atEnd && swipeUp)) return;
    advanceBeat(swipeUp ? 1 : -1);
  }, [advanceBeat, config.beats.length]);

  useEffect(() => {
    if (shouldReduce || window.innerWidth <= 900) return;
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel',      handleWheel,      { passive: false });
    el.addEventListener('keydown',    handleKeyDown);
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend',   handleTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener('wheel',      handleWheel);
      el.removeEventListener('keydown',    handleKeyDown);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend',   handleTouchEnd);
    };
  }, [shouldReduce, handleWheel, handleKeyDown, handleTouchStart, handleTouchEnd]);

  const { frame, width, src, video, url } = config.stage.centerpiece;

  if (shouldReduce) return <StaticFallback config={config} slot={slot} />;

  return (
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
              slot={slot}
            />
          ))}
          <OutroSection smooth={smooth} />
        </div>

        {/* Right: device frame — no animation, just static inside card */}
        <div className="cs-visual-col">
          <div className="cs-device-card">
            {frame === 'browser' && <BrowserFrame width={width} src={src} video={video} url={url} />}
            {frame === 'phone'   && <PhoneFrame   width={width} src={src} video={video} />}
            {frame === 'none' && src && (
              <img src={src} alt="" className="cs-device-standalone-img" loading="lazy" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
