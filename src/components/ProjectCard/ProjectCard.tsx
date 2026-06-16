import Link from 'next/link';
import type { Project, ProjectPreview } from '@/data/projects';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
}

function PreviewPhone({ src }: { src?: string }) {
  return (
    <div className="pc-phone">
      <div className="pc-phone__btn pc-phone__btn--action" />
      <div className="pc-phone__btn pc-phone__btn--vol-up" />
      <div className="pc-phone__btn pc-phone__btn--vol-down" />
      <div className="pc-phone__btn pc-phone__btn--power" />
      <div className="pc-phone__screen">
        <div className="pc-phone__island" />
        {src && <img src={src} alt="" className="pc-phone__img" loading="lazy" />}
      </div>
    </div>
  );
}

function PreviewBrowser({ video, url }: { video?: string; url?: string }) {
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
            autoPlay
            loop
            muted
            playsInline
          />
        )}
      </div>
    </div>
  );
}

function CardVisual({ preview, title }: { preview?: ProjectPreview; title: string }) {
  if (!preview) return null;

  if (preview.frame === 'phone') {
    return <PreviewPhone src={preview.src} />;
  }

  if (preview.frame === 'browser') {
    return <PreviewBrowser video={preview.video} url={preview.url} />;
  }

  if (preview.frame === 'image' && preview.src) {
    return (
      <div className="project-card__image-wrap">
        <img src={preview.src} alt={title} className="project-card__image" loading="lazy" />
      </div>
    );
  }

  if (preview.frame === 'fill' && preview.src) {
    return <img src={preview.src} alt={title} className="project-card__image--fill" loading="lazy" />;
  }

  return null;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const bg = project.styles?.backgroundColor ?? '#f4f3f2';

  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-card"
      style={{ backgroundColor: bg }}
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
