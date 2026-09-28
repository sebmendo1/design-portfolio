import {
  PORTFOLIO_INDEX,
  type PortfolioIndexEntry,
  type PortfolioIndexSection,
} from '@/data/portfolioIndex';

export type HomeSectionLogo =
  | {
      kind: 'image';
      src: string;
      background: string;
      /** Chase uses the Figma mark geometry; everything else fits inside an inset. */
      fit: 'chase-mark' | 'cover' | 'inset';
    }
  | {
      kind: 'monogram';
      text: string;
      background: string;
      color: string;
    };

export type HomeSection = {
  id: PortfolioIndexSection;
  label: string;
  logo: HomeSectionLogo;
};

export type HomeSectionGroup = HomeSection & {
  items: PortfolioIndexEntry[];
};

/** Nav pill order is feed order. */
export const HOME_SECTIONS: HomeSection[] = [
  {
    id: 'memento-ai',
    label: 'Memento AI',
    logo: {
      kind: 'image',
      src: '/assets/logos/memento-ai.png',
      background: '#ffffff',
      fit: 'cover',
    },
  },
  {
    id: 'chase-ai',
    label: 'Chase AI',
    logo: {
      kind: 'image',
      src: '/assets/logos/chase-mark-white.svg',
      background: '#005eb8',
      fit: 'chase-mark',
    },
  },
  {
    id: 'chase-home-lending',
    label: 'Chase Home Lending',
    logo: {
      kind: 'image',
      src: '/assets/logos/chase-mark-white.svg',
      background: '#005eb8',
      fit: 'chase-mark',
    },
  },
  {
    id: 'salesforce',
    label: 'Salesforce',
    logo: {
      kind: 'image',
      src: '/assets/logos/salesforce.svg',
      background: '#ffffff',
      fit: 'inset',
    },
  },
  {
    id: 'writer-ai',
    label: 'WRITER AI',
    logo: {
      kind: 'image',
      src: '/assets/logos/writer.png',
      background: '#ffffff',
      fit: 'cover',
    },
  },
  {
    id: 'chorus-ai',
    label: 'Chorus AI',
    logo: {
      kind: 'image',
      src: '/assets/logos/chorus-ai.svg',
      background: '#ffffff',
      fit: 'cover',
    },
  },
  {
    id: 'other',
    label: 'Other',
    logo: { kind: 'monogram', text: 'Aa', background: '#000000', color: '#ffffff' },
  },
];

export function groupHomeSections(
  entries: PortfolioIndexEntry[] = PORTFOLIO_INDEX,
): HomeSectionGroup[] {
  return HOME_SECTIONS.map((section) => ({
    ...section,
    items: entries.filter((entry) => entry.section === section.id),
  })).filter((section) => section.items.length > 0);
}

export function findHomeSection(id: PortfolioIndexSection): HomeSection | undefined {
  return HOME_SECTIONS.find((section) => section.id === id);
}
