import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { ProjectPreview } from '@/data/projects';
import { getVideoPoster } from '@/data/assets';
import { DEFAULT_BROWSER_SCREEN_AR } from '@/components/BrowserStencil/browser-aspect-ratios';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { LazyAutoplayVideo } from '@/components/LazyAutoplayVideo/LazyAutoplayVideo';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import type { ProjectCardSummary } from '@/lib/project-cards';
import './ProjectCard.css';

interface ProjectCardProps {
  project: ProjectCardSummary;
  onNavigate?: (href: string) => void;
}

function PreviewBrowser({
  video,
  url,
  screenAspectRatio,
}: {
  video?: string;
  url?: string;
  screenAspectRatio?: number;
}) {
  const poster = video ? getVideoPoster(video) : undefined;
  const contentAspectRatio = screenAspectRatio ?? DEFAULT_BROWSER_SCREEN_AR;

  return (
    <div
      className="pc-browser"
      style={{ '--content-ar': contentAspectRatio } as CSSProperties}
    >
      <div className="pc-browser__chrome">
        <div className="pc-browser__dots">
          <span className="pc-dot pc-dot--red" />
          <span className="pc-dot pc-dot--yellow" />
          <span className="pc-dot pc-dot--green" />
        </div>
        <div className="pc-browser__url-bar">
          <span className="pc-browser__url-text">{url ?? ''}</span>
        </div>
        <div className="pc-browser__spacer" />
      </div>
      <div className="pc-browser__screen">
        {video && (
          <LazyAutoplayVideo
            className="pc-browser__video"
            src={video}
            poster={poster}
          />
        )}
      </div>
    </div>
  );
}

function CardVisual({ preview, title }: { preview?: ProjectPreview; title: string }) {
  if (!preview) return null;

  if (preview.frame === 'phone') {
    return (
      <PhoneStencil
        src={preview.src}
        alt={`${title} app preview`}
        screenAspectRatio={preview.screenAspectRatio}
        variant="card"
      />
    );
  }

  if (preview.frame === 'browser') {
    return (
      <PreviewBrowser
        video={preview.video}
        url={preview.url}
        screenAspectRatio={preview.screenAspectRatio}
      />
    );
  }

  if (preview.frame === 'image' && preview.src) {
    return (
      <div className="project-card__image-wrap">
        <OptimizedImage
          src={preview.src}
          alt={title}
          width={400}
          height={300}
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

export function ProjectCard({ project, onNavigate }: ProjectCardProps) {
  const bg = project.styles?.backgroundColor ?? '#f4f3f2';
  const href = `/work/${project.slug}`;
  const frame = project.preview?.frame ?? 'phone';

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
        <h2 className="project-card__title">{project.title}</h2>
        {project.company && (
          <p className="project-card__company">{project.company}</p>
        )}
      </div>
    </Link>
  );
}
