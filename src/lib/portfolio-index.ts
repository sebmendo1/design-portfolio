import {
  getDefaultPortfolioIndexEntry,
  PORTFOLIO_INDEX,
  type PortfolioIndexEntry,
} from '@/data/portfolioIndex';
import type { ProjectCardSummary } from '@/lib/project-cards';

export function findPortfolioIndexEntry(
  id: string,
  entries: PortfolioIndexEntry[] = PORTFOLIO_INDEX,
): PortfolioIndexEntry {
  return (
    entries.find((entry) => entry.id === id) ??
    entries.find((entry) => entry.previewSlug === id) ??
    getDefaultPortfolioIndexEntry()
  );
}

export function getPortfolioIndexHref(entry: PortfolioIndexEntry): string | undefined {
  if (entry.href) return entry.href;
  if (entry.previewSlug) return `/work/${entry.previewSlug}`;
  return undefined;
}

export function isExternalPortfolioHref(href: string): boolean {
  return href.startsWith('https://') || href.startsWith('http://');
}

/** Case-study preview, or a row-specific override such as Salesforce Help Home. */
export function resolveIndexPreviewProject(
  entry: PortfolioIndexEntry,
  projects: ProjectCardSummary[],
): ProjectCardSummary | undefined {
  const project = projects.find((item) => item.slug === entry.previewSlug);
  const preview = entry.preview ?? project?.preview;
  if (!preview) return project;
  return {
    id: entry.id,
    slug: entry.previewSlug ?? project?.slug ?? entry.id,
    title: entry.preview ? entry.label : (project?.title ?? entry.label),
    preview,
    styles: project?.styles,
  };
}
