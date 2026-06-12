'use client';

import { useRef } from 'react';
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

function BrowserFrame({ width, src }: { width: number; src?: string }) {
  return (
    <div className="cs-browser" style={{ width }}>
      <div className="cs-browser__chrome">
        <span className="cs-dot cs-dot--red" />
        <span className="cs-dot cs-dot--yellow" />
        <span className="cs-dot cs-dot--green" />
        <div className="cs-browser__url" />
      </div>
      <div className="cs-browser__screen">
        {src && <img src={src} alt="" className="cs-device-img" loading="lazy" />}
      </div>
    </div>
  );
}

function PhoneFrame({ src }: { width: number; src?: string }) {
  return (
    <div className="cs-phone">
      <div className="cs-phone__btn cs-phone__btn--action" />
      <div className="cs-phone__btn cs-phone__btn--vol-up" />
      <div className="cs-phone__btn cs-phone__btn--vol-down" />
      <div className="cs-phone__btn cs-phone__btn--power" />
      <div className="cs-phone__screen">
        <div className="cs-phone__island" />
        {src
          ? <img src={src} alt="" className="cs-device-img" loading="lazy" />
          : <div className="cs-phone__screen-fill" />
        }
      </div>
    </div>
  );
}

// ─── Animated text section ────────────────────────────────────────────────────

function TextSection({ beat, smooth, isFirst }: {
  beat: Beat;
  smooth: MotionValue<number>;
  isFirst: boolean;
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
    <motion.section className="cs-section" style={{ opacity, y }}>
      <p className="cs-section__label">{beat.label}</p>
      <h2 className="cs-section__headline">{beat.headline}</h2>
      {beat.body && <p className="cs-section__body">{beat.body}</p>}
    </motion.section>
  );
}

// ─── Reduced-motion fallback ──────────────────────────────────────────────────

function StaticFallback({ config }: { config: CaseStudyConfig }) {
  const { frame, width, src } = config.stage.centerpiece;
  return (
    <div className="cs-layout cs-layout--static">
      <div className="cs-text-col cs-text-col--static">
        {config.beats.map((beat) => (
          <section key={beat.id} className="cs-section cs-section--static">
            <p className="cs-section__label">{beat.label}</p>
            <h2 className="cs-section__headline">{beat.headline}</h2>
            {beat.body && <p className="cs-section__body">{beat.body}</p>}
          </section>
        ))}
      </div>
      <div className="cs-visual-col">
        <div className="cs-sticky">
          <div className="cs-device-card">
            {frame === 'browser' && <BrowserFrame width={width} src={src} />}
            {frame === 'phone'   && <PhoneFrame   width={width} src={src} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CaseStudyScrolly({ config }: { config: CaseStudyConfig }) {
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

  const { frame, width, src } = config.stage.centerpiece;

  if (shouldReduce) return <StaticFallback config={config} />;

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
            />
          ))}
        </div>

        {/* Right: device frame — no animation, just static inside card */}
        <div className="cs-visual-col">
          <div className="cs-device-card">
            {frame === 'browser' && <BrowserFrame width={width} src={src} />}
            {frame === 'phone'   && <PhoneFrame   width={width} src={src} />}
          </div>
        </div>
      </div>
    </div>
  );
}
