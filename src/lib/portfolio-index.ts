import {
  getDefaultPortfolioIndexEntry,
  PORTFOLIO_INDEX,
  type PortfolioIndexEntry,
  type PortfolioIndexSection,
} from '@/data/portfolioIndex';
import type { ProjectCardSummary } from '@/lib/project-cards';

export type PortfolioIndexYearGroup = {
  year: number;
  items: PortfolioIndexEntry[];
};

export type PortfolioIndexGroupedSection = {
  id: PortfolioIndexSection;
  years: PortfolioIndexYearGroup[];
};

const SECTION_ORDER: PortfolioIndexSection[] = ['projects', 'work'];

export function groupPortfolioIndex(
  entries: PortfolioIndexEntry[] = PORTFOLIO_INDEX,
): PortfolioIndexGroupedSection[] {
  return SECTION_ORDER.map((section) => {
    const items = entries.filter((entry) => entry.section === section);
    const years: number[] = [];
    const byYear = new Map<number, PortfolioIndexEntry[]>();

    for (const item of items) {
      const existing = byYear.get(item.year);
      if (existing) {
        existing.push(item);
      } else {
        byYear.set(item.year, [item]);
        years.push(item.year);
      }
    }

    return {
      id: section,
      years: years.map((year) => ({
        year,
        items: byYear.get(year) ?? [],
      })),
    };
  });
}

export function findPortfolioIndexEntry(
  id: string,
  entries: PortfolioIndexEntry[] = PORTFOLIO_INDEX,
): PortfolioIndexEntry {
  return (
    entries.find((entry) => entry.id === id || entry.previewSlug === id) ??
    getDefaultPortfolioIndexEntry()
  );
}

export function resolvePortfolioIndexId(
  value?: string,
  entries: PortfolioIndexEntry[] = PORTFOLIO_INDEX,
): string {
  if (!value) return getDefaultPortfolioIndexEntry().id;
  return findPortfolioIndexEntry(value, entries).id;
}

export function getPortfolioIndexHref(entry: PortfolioIndexEntry): string | undefined {
  if (entry.href) return entry.href;
  if (entry.previewSlug) return `/work/${entry.previewSlug}`;
  return undefined;
}

/** Case-study preview, or a row-specific override such as Salesforce Help Home. */
export function resolveIndexPreviewProject(
  entry: PortfolioIndexEntry,
  projects: ProjectCardSummary[],
): ProjectCardSummary | undefined {
  const project = projects.find((item) => item.slug === entry.previewSlug);
  if (!entry.preview) return project;
  return {
    id: entry.id,
    slug: entry.previewSlug ?? project?.slug ?? entry.id,
    title: entry.label,
    preview: entry.preview,
    styles: project?.styles,
  };
}
