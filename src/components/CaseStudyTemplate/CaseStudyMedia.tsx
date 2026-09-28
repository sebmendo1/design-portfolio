'use client';

import type { CSSProperties } from 'react';
import { BrowserStencil } from '@/components/BrowserStencil/BrowserStencil';
import { DEFAULT_BROWSER_SCREEN_AR } from '@/components/BrowserStencil/browser-aspect-ratios';
import { TypeSpecimen, VoiceSpecimen } from '@/components/HomeProjectCard/HomeProjectCard';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import { DEFAULT_PHONE_SCREEN_AR } from '@/components/PhoneStencil/phone-aspect-ratios';
import { getVideoPoster } from '@/data/assets';
import type { CaseStudyFigure, CaseStudyMedia as Media } from '@/data/caseStudies/types';
import type { HomeSectionLogo } from '@/lib/home-sections';

const WEIGHTS = [300, 430, 530, 600, 760, 900];
const GLYPHS = 'AaBbGgQqRr0123&@?!%';
const STREAM_SAMPLE =
  'Streaming text arrives a few words at a time, so every letter has to hold its shape while the sentence is still being written.';

function TypefaceSpecimen({ variant }: { variant: 'hero' | 'weights' | 'stream' | 'glyphs' }) {
  if (variant === 'hero') return <TypeSpecimen />;

  if (variant === 'weights') {
    return (
      <div className="study-type study-type--weights" aria-hidden="true">
        {WEIGHTS.map((weight) => (
          <p
            key={weight}
            className="study-type__weight"
            style={{ fontVariationSettings: `'wght' ${weight}, 'opsz' 32` } as CSSProperties}
          >
            <span>Seb Sans</span>
            <span className="study-type__weight-value">{weight}</span>
          </p>
        ))}
      </div>
    );
  }

  if (variant === 'glyphs') {
    return (
      <div className="study-type study-type--glyphs" aria-hidden="true">
        {Array.from(GLYPHS).map((glyph, index) => (
          <span key={`${glyph}-${index}`} className="study-type__glyph">
            {glyph}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="study-type study-type--stream" aria-hidden="true">
      <p className="study-type__stream">
        {STREAM_SAMPLE}
        <span className="study-type__caret" />
      </p>
    </div>
  );
}

function MediaItem({
  item,
  logo,
  priority,
}: {
  item: Media;
  logo?: HomeSectionLogo;
  priority: boolean;
}) {
  switch (item.type) {
    case 'phone':
      return (
        <PhoneStencil
          src={item.src}
          video={item.video}
          poster={item.video ? getVideoPoster(item.video) : undefined}
          alt={item.alt}
          screenAspectRatio={DEFAULT_PHONE_SCREEN_AR}
          lockAspectRatio
          variant="card"
          className="home-card__device home-card__device--phone"
          priority={priority}
        />
      );
    case 'browser':
      return (
        <BrowserStencil
          src={item.src}
          video={item.video}
          poster={item.video ? getVideoPoster(item.video) : undefined}
          url={item.url}
          title={item.alt}
          screenAspectRatio={item.screenAspectRatio ?? DEFAULT_BROWSER_SCREEN_AR}
          lockAspectRatio={!item.video}
          variant="card"
          className="home-card__device home-card__device--desktop"
          priority={priority}
        />
      );
    case 'image':
      return (
        <OptimizedImage
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className="study-figure__image"
          sizes="(max-width: 900px) 92vw, 600px"
          priority={priority}
        />
      );
    case 'voice':
      return <VoiceSpecimen logo={logo} />;
    case 'typeface':
      return <TypefaceSpecimen variant={item.variant} />;
  }
}

function figureLabel(figure: CaseStudyFigure) {
  return figure.media.map((item) => item.alt).join('; ');
}

export function CaseStudyFigureView({
  figure,
  logo,
  priority = false,
}: {
  figure: CaseStudyFigure;
  logo?: HomeSectionLogo;
  priority?: boolean;
}) {
  const decorative = figure.media.every((item) => item.type === 'voice' || item.type === 'typeface');
  const phones = figure.media.length > 1 && figure.media.every((item) => item.type === 'phone');

  return (
    <figure className="study-figure">
      <div
        className={`home-card__media study-figure__well study-figure__well--${figure.shape ?? 'default'}`}
        role={decorative ? 'img' : undefined}
        aria-label={decorative ? figureLabel(figure) : undefined}
      >
        <div className="home-card__stage">
          {phones ? (
            <div className="home-card__phone-pair">
              {figure.media.map((item, index) => (
                <MediaItem key={index} item={item} logo={logo} priority={priority && index === 0} />
              ))}
            </div>
          ) : figure.media.length > 1 ? (
            <div className="study-figure__stack">
              {figure.media.map((item, index) => (
                <MediaItem key={index} item={item} logo={logo} priority={priority && index === 0} />
              ))}
            </div>
          ) : (
            <MediaItem item={figure.media[0]} logo={logo} priority={priority} />
          )}
        </div>
      </div>
      {figure.caption ? <figcaption className="study-figure__caption">{figure.caption}</figcaption> : null}
    </figure>
  );
}
