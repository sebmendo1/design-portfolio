'use client';

import type { CSSProperties, MouseEvent } from 'react';
import Link from 'next/link';
import { BrowserStencil } from '@/components/BrowserStencil/BrowserStencil';
import { DEFAULT_BROWSER_SCREEN_AR } from '@/components/BrowserStencil/browser-aspect-ratios';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import { DEFAULT_PHONE_SCREEN_AR } from '@/components/PhoneStencil/phone-aspect-ratios';
import { getVideoPoster } from '@/data/assets';
import type { PortfolioIndexEntry } from '@/data/portfolioIndex';
import type { ProjectPreview } from '@/data/projects';
import type { HomeSectionLogo } from '@/lib/home-sections';
import { getPortfolioIndexHref, isExternalPortfolioHref } from '@/lib/portfolio-index';
import type { ProjectCardSummary } from '@/lib/project-cards';
import './HomeProjectCard.css';

type HomeProjectCardProps = {
  entry: PortfolioIndexEntry;
  project?: ProjectCardSummary;
  logo?: HomeSectionLogo;
  priority?: boolean;
  onNavigate?: (href: string) => void;
};

const MEDIA_SIZES = '(max-width: 900px) 90vw, 560px';

function TypeSpecimen() {
  return (
    <div className="home-card__specimen" aria-hidden="true">
      <p className="home-card__specimen-word">Seb Sans</p>
      <p className="home-card__specimen-meta">Variable typeface for AI interfaces</p>
    </div>
  );
}

const VOICE_BARS = [
  0.28, 0.46, 0.72, 0.52, 0.9, 0.64, 0.38, 0.58, 1, 0.74, 0.44, 0.66, 0.86, 0.5, 0.3, 0.56, 0.8,
  0.6, 0.36, 0.24,
];

function VoiceSpecimen({ logo }: { logo?: HomeSectionLogo }) {
  return (
    <div className="home-card__voice" aria-hidden="true">
      {logo ? <HomeLogo logo={logo} /> : null}
      <div className="home-card__voice-wave">
        {VOICE_BARS.map((height, index) => (
          <span
            key={index}
            className="home-card__voice-bar"
            style={{ '--bar-h': height, '--bar-i': index } as CSSProperties}
          />
        ))}
      </div>
      <div className="home-card__voice-caption">
        <p className="home-card__specimen-word home-card__voice-word">Casey Voice</p>
        <p className="home-card__specimen-meta">Live in Chase home lending since July 2025</p>
      </div>
    </div>
  );
}

function DevicePreview({
  project,
  preview,
  priority,
}: {
  project?: ProjectCardSummary;
  preview?: ProjectPreview;
  priority: boolean;
}) {
  const resolved = preview ?? project?.preview;
  if (!resolved) return null;
  const title = project?.title ?? 'Project';

  if (resolved.frame === 'phone') {
    const phones = [
      { src: resolved.src, video: resolved.video },
      ...(resolved.companions ?? []),
    ];

    const nodes = phones.map((device, index) => (
      <PhoneStencil
        key={`${device.video ?? device.src ?? index}`}
        src={device.src}
        video={device.video}
        poster={device.video ? getVideoPoster(device.video) : undefined}
        alt={index === 0 ? `${title} preview` : `${title} preview ${index + 1}`}
        screenAspectRatio={DEFAULT_PHONE_SCREEN_AR}
        lockAspectRatio
        variant="card"
        className="home-card__device home-card__device--phone"
        priority={priority}
      />
    ));

    if (nodes.length > 1) {
      return <div className="home-card__phone-pair">{nodes}</div>;
    }
    return nodes[0] ?? null;
  }

  if (resolved.frame === 'browser') {
    return (
      <BrowserStencil
        src={resolved.src}
        video={resolved.video}
        poster={resolved.video ? getVideoPoster(resolved.video) : undefined}
        url={resolved.url}
        title={title}
        screenAspectRatio={resolved.screenAspectRatio ?? DEFAULT_BROWSER_SCREEN_AR}
        lockAspectRatio={!resolved.video}
        variant="card"
        className="home-card__device home-card__device--desktop"
        priority={priority}
      />
    );
  }

  if ((resolved.frame === 'image' || resolved.frame === 'fill') && resolved.src) {
    return (
      <OptimizedImage
        src={resolved.src}
        alt={`${title} preview`}
        width={1200}
        height={Math.round(1200 / DEFAULT_BROWSER_SCREEN_AR)}
        className="home-card__image"
        sizes={MEDIA_SIZES}
        priority={priority}
      />
    );
  }

  return null;
}

export function HomeLogo({ logo }: { logo: HomeSectionLogo }) {
  if (logo.kind === 'monogram') {
    return (
      <span
        className="home-logo home-logo--monogram"
        style={{ backgroundColor: logo.background, color: logo.color }}
        aria-hidden="true"
      >
        {logo.text}
      </span>
    );
  }

  return (
    <span
      className={`home-logo home-logo--${logo.fit}`}
      style={{ backgroundColor: logo.background }}
      aria-hidden="true"
    >
      {logo.fit === 'chase-mark' ? (
        <span className="home-logo__mark">
          <span className="home-logo__mark-canvas">
            <OptimizedImage src={logo.src} alt="" width={142} height={142} fill sizes="222px" />
          </span>
        </span>
      ) : (
        <OptimizedImage
          src={logo.src}
          alt=""
          width={88}
          height={88}
          sizes="44px"
          className="home-logo__img"
        />
      )}
    </span>
  );
}

export function HomeProjectCard({
  entry,
  project,
  logo,
  priority = false,
  onNavigate,
}: HomeProjectCardProps) {
  const href = getPortfolioIndexHref(entry);
  const external = Boolean(href && isExternalPortfolioHref(href));

  const content = (
    <>
      <div className="home-card__media">
        <div className="home-card__stage">
          {entry.kind === 'typeface' ? (
            <TypeSpecimen />
          ) : entry.kind === 'voice' ? (
            <VoiceSpecimen logo={logo} />
          ) : (
            <DevicePreview project={project} preview={entry.preview} priority={priority} />
          )}
        </div>
      </div>
      <div className="home-card__meta">
        {logo ? <HomeLogo logo={logo} /> : null}
        <div className="home-card__text">
          <h3 className="home-card__title">{entry.label}</h3>
          <p className="home-card__description">
            {entry.description}
            {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </p>
        </div>
      </div>
    </>
  );

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!href || !onNavigate) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate(href);
  }

  return (
    <article className="home-card" data-entry-id={entry.id}>
      {!href ? (
        <div className="home-card__link">{content}</div>
      ) : external ? (
        <a href={href} className="home-card__link" target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <Link href={href} className="home-card__link" onClick={handleClick}>
          {content}
        </Link>
      )}
    </article>
  );
}
