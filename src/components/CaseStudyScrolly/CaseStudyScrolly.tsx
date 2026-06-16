'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useScroll,
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

  return (
    <motion.section className={`cs-section${isFirst ? ' cs-section--hero' : ''}`} style={{ opacity, y }}>
      {beat.label && <p className="cs-section__label">{beat.label}</p>}
      <h2 className="cs-section__headline">{beat.headline}</h2>
      {beat.body && <p className="cs-section__body">{beat.body}</p>}
      {isFirst && slot && <div className="cs-section__slot">{slot}</div>}
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
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const { frame, width, src, video, url } = config.stage.centerpiece;

  if (shouldReduce) return <StaticFallback config={config} slot={slot} />;

  return (
    <div
      ref={trackRef}
      className="cs-track"
      style={{ height: `${config.trackHeightVh}vh` }}
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
