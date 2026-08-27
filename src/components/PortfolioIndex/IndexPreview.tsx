'use client';

import type { CSSProperties } from 'react';
import { BrowserStencil } from '@/components/BrowserStencil/BrowserStencil';
import { DEFAULT_BROWSER_SCREEN_AR } from '@/components/BrowserStencil/browser-aspect-ratios';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import { getVideoPoster } from '@/data/assets';
import type { PortfolioIndexEntry } from '@/data/portfolioIndex';
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
          sizes="(max-width: 900px) 100vw, 55vw"
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
        sizes="(max-width: 900px) 100vw, 55vw"
      />
    );
  }

  return null;
}

function OpenProjectIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M12 12 4 4M4 4h7M4 4v7"
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
  const href = entry.href;

  return (
    <div className="portfolio-index__well" style={{ backgroundColor: entry.tint }}>
      {href ? (
        <a
          href={href}
          className="portfolio-index__open"
          aria-label={`Open ${entry.label}`}
          onClick={(event) => {
            if (!onNavigate) return;
            event.preventDefault();
            onNavigate(href);
          }}
        >
          <OpenProjectIcon />
        </a>
      ) : null}
      <div className="portfolio-index__well-inner" aria-hidden="true">
        {entry.kind === 'typeface' ? (
          <TypeSpecimen label={entry.label} />
        ) : project ? (
          <DevicePreview project={project} />
        ) : null}
      </div>
    </div>
  );
}
