'use client';

import { Fragment, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';
import type { CaseStudyConfig } from './types';
import { getVideoPoster } from '@/data/assets';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import { BrowserStencil } from '@/components/BrowserStencil/BrowserStencil';
import {
  DissolveIn,
  DISSOLVE_REVEAL_DURATION,
  DISSOLVE_REVEAL_EASE,
  DISSOLVE_REVEAL_STAGGER,
} from '@/components/DissolveIn/DissolveIn';
import './CaseStudyScrolly.css';

const CHASE_HERO_SRC = '/assets/logos/chase-hero.png?v=11';

function isChaseCompany(company?: string): boolean {
  return company === 'JPMorgan Chase' || company === 'Chase';
}

function showsDesktopHeroLogo(company?: string, companyLogo?: string): boolean {
  return Boolean(companyLogo && (isChaseCompany(company) || company === 'Salesforce'));
}

function heroLogoClassName(company?: string, companyLogo?: string): string {
  const classes = ['cs-section__logo'];
  if (!showsDesktopHeroLogo(company, companyLogo)) return classes.join(' ');

  classes.push('cs-section__logo--brand');
  if (isChaseCompany(company)) classes.push('cs-section__logo--chase');
  if (company === 'Salesforce') classes.push('cs-section__logo--salesforce');
  return classes.join(' ');
}

/** Wheel travel multiplier when scrolling from outside the text column. */
const EXTERNAL_SCROLL_BOOST = 1.4;

function normalizeWheelDelta(deltaY: number, deltaMode: number): number {
  if (deltaMode === 1) return deltaY * 40;
  if (deltaMode === 2) return deltaY * 500;
  return deltaY;
}

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

function DevicePreview({ config }: { config: CaseStudyConfig }) {
  const { frame, src, video, url, screenAspectRatio } = config.stage.centerpiece;
  const title = config.title;

  return (
    <div className="cs-device-card">
      {frame === 'browser' && (
        <BrowserStencil
          src={src}
          video={video}
          poster={video ? getVideoPoster(video) : undefined}
          url={url}
          title={title}
          screenAspectRatio={screenAspectRatio}
          variant="case-study"
        />
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
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      )}
    </div>
  );
}

export function CaseStudyScrolly({
  config,
  company,
  companyLogo,
  slot,
  onHomeNavigate,
}: {
  config: CaseStudyConfig;
  company?: string;
  companyLogo?: string;
  slot?: ReactNode;
  onHomeNavigate?: (href: string) => void;
}) {
  const layoutRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    const content = scrollContentRef.current;
    const layout = layoutRef.current;
    if (!wrapper || !content || !layout) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      wrapper.style.overflowY = 'auto';
      return;
    }

    const lenis = new Lenis({
      wrapper,
      content,
      smoothWheel: true,
      lerp: 0.09,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onLayoutWheel = (event: WheelEvent) => {
      if (wrapper.contains(event.target as Node)) return;
      const delta = normalizeWheelDelta(event.deltaY, event.deltaMode) * EXTERNAL_SCROLL_BOOST;
      lenis.scrollTo(lenis.scroll + delta);
      event.preventDefault();
    };

    layout.addEventListener('wheel', onLayoutWheel, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      layout.removeEventListener('wheel', onLayoutWheel);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layout = layoutRef.current;
    if (!layout) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <article className="cs-article" aria-label={config.title}>
      <div ref={layoutRef} className="cs-layout">
        <HomeLink className="cs-floating-back" onHomeNavigate={onHomeNavigate}>
          ← Back
        </HomeLink>

        <DissolveIn
          className="cs-text-col-viewport"
          duration={DISSOLVE_REVEAL_DURATION}
          ease={DISSOLVE_REVEAL_EASE}
        >
          <div ref={scrollWrapperRef} className="cs-text-col">
            <div ref={scrollContentRef} className="cs-text-col__content">
            {config.beats.map((beat, i) => {
              if (i === 0) {
                return (
                  <Fragment key={beat.id}>
                    <section className="cs-section cs-section--hero">
                      {(isChaseCompany(company) || companyLogo) && (
                        <div className={heroLogoClassName(company, companyLogo)}>
                          <img
                            src={isChaseCompany(company) ? CHASE_HERO_SRC : companyLogo!}
                            alt={company ?? ''}
                            className="cs-section__logo-img"
                            width={isChaseCompany(company) ? 1024 : 960}
                            height={isChaseCompany(company) ? 190 : 672}
                            decoding="async"
                          />
                        </div>
                      )}
                      <h1 className="cs-section__headline">{beat.headline}</h1>
                      {slot && <div className="cs-section__slot">{slot}</div>}
                    </section>
                    {beat.body && (
                      <section className="cs-section cs-section--intro">
                        <p className="cs-section__body">{beat.body}</p>
                      </section>
                    )}
                  </Fragment>
                );
              }

              return (
                <section key={beat.id} className="cs-section">
                  {beat.label && <p className="cs-section__label">{beat.label}</p>}
                  <h2 className="cs-section__headline">{beat.headline}</h2>
                  {beat.body && <p className="cs-section__body">{beat.body}</p>}
                </section>
              );
            })}

            <section className="cs-section cs-section--outro">
              <p className="cs-section__label">More work</p>
              <h2 className="cs-section__headline">See the rest of my projects.</h2>
              <div className="cs-section__slot">
                <HomeLink className="cs-outro__btn" onHomeNavigate={onHomeNavigate}>
                  View all projects
                </HomeLink>
              </div>
            </section>
          </div>
          </div>
          <div className="cs-text-col__edge cs-text-col__edge--top" aria-hidden="true" />
          <div className="cs-text-col__edge cs-text-col__edge--bottom" aria-hidden="true" />
        </DissolveIn>

        <DissolveIn
          className="cs-visual-col"
          delay={DISSOLVE_REVEAL_STAGGER}
          duration={DISSOLVE_REVEAL_DURATION}
          ease={DISSOLVE_REVEAL_EASE}
        >
          <DevicePreview config={config} />
        </DissolveIn>
      </div>
    </article>
  );
}
