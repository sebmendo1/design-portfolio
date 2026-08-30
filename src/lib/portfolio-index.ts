import {
  getDefaultPortfolioIndexEntry,
  PORTFOLIO_INDEX,
  type PortfolioIndexEntry,
  type PortfolioIndexSection,
} from '@/data/portfolioIndex';

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
