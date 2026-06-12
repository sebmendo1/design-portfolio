import Link from 'next/link';
import type { Project } from '@/data/projects';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
}

function CardPhone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="pc-phone">
      <div className="pc-phone__btn pc-phone__btn--action" />
      <div className="pc-phone__btn pc-phone__btn--vol-up" />
      <div className="pc-phone__btn pc-phone__btn--vol-down" />
      <div className="pc-phone__btn pc-phone__btn--power" />
      <div className="pc-phone__screen">
        <div className="pc-phone__island" />
        <img src={src} alt={alt} className="pc-phone__img" loading="lazy" />
      </div>
    </div>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const bg = project.styles?.backgroundColor ?? '#f4f3f2';
  const centerpiece = project.scrollyConfig?.stage.centerpiece;
  const isPhone = centerpiece?.frame === 'phone' && centerpiece?.src;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-card"
      style={{ backgroundColor: bg }}
    >
      <div className="project-card__visual">
        {isPhone ? (
          <CardPhone src={centerpiece.src!} alt={project.title} />
        ) : project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="project-card__image"
            loading="lazy"
          />
        ) : null}
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
