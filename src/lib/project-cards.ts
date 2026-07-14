import type { Project, ProjectPreview, ProjectStyles } from '@/data/projects';

/** Minimal project data for client-side work page cards — avoids shipping full case-study configs. */
export type ProjectCardSummary = {
  id: string;
  slug: string;
  title: string;
  company?: string;
  preview?: ProjectPreview;
  styles?: ProjectStyles;
};

export function toProjectCardSummary(project: Project): ProjectCardSummary {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    company: project.company,
    preview: project.preview,
    styles: project.styles,
  };
}

export function toProjectCardSummaries(projects: Project[]): ProjectCardSummary[] {
  return projects.map(toProjectCardSummary);
}
