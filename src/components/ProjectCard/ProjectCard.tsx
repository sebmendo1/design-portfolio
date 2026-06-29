import Link from 'next/link';
import type { Project, ProjectPreview } from '@/data/projects';
import { getVideoPoster } from '@/data/assets';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  onNavigate?: (href: string) => void;
}

function PreviewBrowser({ video, url }: { video?: string; url?: string }) {
  const poster = video ? getVideoPoster(video) : undefined;

  return (
    <div className="pc-browser">
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
          <video
            className="pc-browser__video"
            src={video}
            poster={poster}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
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
    return <PreviewBrowser video={preview.video} url={preview.url} />;
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

  return (
    <Link
      href={href}
      className="project-card"
      style={{ backgroundColor: bg }}
      onClick={(event) => {
        if (!onNavigate) return;
        event.preventDefault();
        onNavigate(href);
      }}
    >
      <div className="project-card__visual">
        <CardVisual preview={project.preview} title={project.title} />
      </div>
      <div className="project-card__meta">
        <span className="project-card__title">{project.title}</span>
        {project.company && (
          <span className="project-card__company">{project.company}</span>
        )}
      </div>
    </Link>
  );
}
