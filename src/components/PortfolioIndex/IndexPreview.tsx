'use client';

import type { CSSProperties, MouseEvent } from 'react';
import { BrowserStencil } from '@/components/BrowserStencil/BrowserStencil';
import { DEFAULT_BROWSER_SCREEN_AR } from '@/components/BrowserStencil/browser-aspect-ratios';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import { getVideoPoster } from '@/data/assets';
import type { PortfolioIndexEntry } from '@/data/portfolioIndex';
import { getPortfolioIndexHref } from '@/lib/portfolio-index';
import type { ProjectCardSummary } from '@/lib/project-cards';

type IndexPreviewProps = {
  entry: PortfolioIndexEntry;
  project?: ProjectCardSummary;
  onNavigate?: (href: string) => void;
};

function TypeSpecimen({ label }: { label: string }) {
  return (
    <div className="portfolio-index__specimen" aria-hidden="true">
      <p className="portfolio-index__specimen-word">Seb Sans</p>
      <p className="portfolio-index__specimen-meta">{label}</p>
    </div>
  );
}

function DevicePreview({ project }: { project: ProjectCardSummary }) {
  const preview = project.preview;
  if (!preview) return null;

  if (preview.frame === 'phone') {
    const poster = preview.video ? getVideoPoster(preview.video) : undefined;

    return (
      <PhoneStencil
        src={preview.src}
        video={preview.video}
        poster={poster}
        alt={`${project.title} preview`}
        screenAspectRatio={preview.screenAspectRatio}
        variant="card"
        className="portfolio-index__device"
        priority
      />
    );
  }

  if (preview.frame === 'browser') {
    return (
      <BrowserStencil
        src={preview.src}
        video={preview.video}
        poster={preview.video ? getVideoPoster(preview.video) : undefined}
        url={preview.url}
        title={project.title}
        screenAspectRatio={preview.screenAspectRatio}
        variant="card"
        className="portfolio-index__device"
        priority
      />
    );
  }

  if (preview.frame === 'image' && preview.src) {
    const contentAspectRatio = preview.screenAspectRatio ?? DEFAULT_BROWSER_SCREEN_AR;

    return (
      <div
        className="portfolio-index__image-wrap"
        style={{ '--content-ar': contentAspectRatio } as CSSProperties}
      >
        <OptimizedImage
          src={preview.src}
          alt={project.title}
          width={1280}
          height={Math.round(1280 / contentAspectRatio)}
          className="portfolio-index__image"
          sizes="(max-width: 900px) 100vw, min(55vw, 800px)"
        />
      </div>
    );
  }

  if (preview.frame === 'fill' && preview.src) {
    return (
      <OptimizedImage
        src={preview.src}
        alt={project.title}
        width={1200}
        height={800}
        className="portfolio-index__image--fill"
        sizes="(max-width: 900px) 100vw, min(55vw, 800px)"
      />
    );
  }

  return null;
}

function OpenProjectIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M4 12 12 4M12 4H5M12 4v7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IndexPreview({ entry, project, onNavigate }: IndexPreviewProps) {
  const href = getPortfolioIndexHref(entry);

  const inner = (
    <>
      {href ? (
        <span className="portfolio-index__open" aria-hidden="true">
          <OpenProjectIcon />
        </span>
      ) : null}
      <div className="portfolio-index__well-inner">
        {entry.kind === 'typeface' ? (
          <TypeSpecimen label={entry.label} />
        ) : project ? (
          <DevicePreview project={project} />
        ) : null}
      </div>
    </>
  );

  function handleOpen(event: MouseEvent<HTMLAnchorElement>) {
    if (!href || !onNavigate) return;
    event.preventDefault();
    onNavigate(href);
  }

  if (href) {
    return (
      <a
        href={href}
        className="portfolio-index__well portfolio-index__well--link"
        style={{ backgroundColor: entry.tint }}
        aria-label={`Open ${entry.label}`}
        onClick={handleOpen}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="portfolio-index__well" style={{ backgroundColor: entry.tint }}>
      {inner}
    </div>
  );
}
