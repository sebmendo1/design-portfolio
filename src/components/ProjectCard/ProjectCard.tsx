'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { ProjectPreview } from '@/data/projects';
import { getVideoPoster } from '@/data/assets';
import { DEFAULT_BROWSER_SCREEN_AR } from '@/components/BrowserStencil/browser-aspect-ratios';
import { BrowserStencil } from '@/components/BrowserStencil/BrowserStencil';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import {
  splitIntoUnits,
  streamDurationMs,
  StreamingText,
} from '@/components/StreamingText/StreamingText';
import '@/components/StreamingText/StreamingText.css';
import type { ProjectCardSummary } from '@/lib/project-cards';
import './ProjectCard.css';

interface ProjectCardProps {
  project: ProjectCardSummary;
  onNavigate?: (href: string) => void;
  streamMeta?: boolean;
  metaReveal?: boolean;
}

function CardVisual({ preview, title }: { preview?: ProjectPreview; title: string }) {
  if (!preview) return null;

  if (preview.frame === 'phone') {
    const poster = preview.video ? getVideoPoster(preview.video) : undefined;

    return (
      <PhoneStencil
        src={preview.src}
        video={preview.video}
        poster={poster}
        alt={`${title} app preview`}
        screenAspectRatio={preview.screenAspectRatio}
        variant="card"
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
        title={title}
        screenAspectRatio={preview.screenAspectRatio}
        variant="card"
      />
    );
  }

  if (preview.frame === 'image' && preview.src) {
    const contentAspectRatio = preview.screenAspectRatio ?? DEFAULT_BROWSER_SCREEN_AR;

    return (
      <div
        className="project-card__image-wrap"
        style={{ '--content-ar': contentAspectRatio } as CSSProperties}
      >
        <OptimizedImage
          src={preview.src}
          alt={title}
          width={1280}
          height={Math.round(1280 / contentAspectRatio)}
          className="project-card__image"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  if (preview.frame === 'fill' && preview.src) {
    return (
      <OptimizedImage
        src={preview.src}
        alt={title}
        width={600}
        height={400}
        className="project-card__image--fill"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  }

  return null;
}

export function ProjectCard({
  project,
  onNavigate,
  streamMeta = false,
  metaReveal = true,
}: ProjectCardProps) {
  const bg = project.styles?.backgroundColor ?? '#f4f3f2';
  const href = `/work/${project.slug}`;
  const frame = project.preview?.frame ?? 'phone';
  const taglineDelayMs = useMemo(
    () => streamDurationMs(splitIntoUnits(project.title).length),
    [project.title],
  );

  return (
    <Link
      href={href}
      className={`project-card project-card--${frame}`}
      style={{ backgroundColor: bg }}
      onClick={(event) => {
        if (!onNavigate) return;
        event.preventDefault();
        onNavigate(href);
      }}
    >
      <div className="project-card__visual">
        <div className="project-card__visual-inner">
          <CardVisual preview={project.preview} title={project.title} />
        </div>
      </div>
      <div className="project-card__meta">
        {streamMeta ? (
          <>
            <StreamingText
              as="h2"
              className="project-card__title"
              text={project.title}
              reveal={metaReveal}
              aria-label={project.title}
            />
            {project.tagline && (
              <StreamingText
                as="p"
                className="project-card__description"
                text={project.tagline}
                reveal={metaReveal}
                startDelayMs={taglineDelayMs}
              />
            )}
          </>
        ) : (
          <>
            <h2 className="project-card__title">{project.title}</h2>
            {project.tagline && (
              <p className="project-card__description">{project.tagline}</p>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
