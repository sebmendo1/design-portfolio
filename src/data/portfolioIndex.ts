export type PortfolioIndexSection = 'projects' | 'work';

export type PortfolioIndexKind = 'device' | 'typeface';

export type PortfolioIndexEntry = {
  id: string;
  year: number;
  label: string;
  section: PortfolioIndexSection;
  href?: string;
  previewSlug?: string;
  kind?: PortfolioIndexKind;
  tint: string;
};

const TINT = {
  chase: 'rgba(0, 94, 184, 0.08)',
  memento: 'rgba(196, 176, 148, 0.16)',
  type: 'rgba(0, 0, 0, 0.04)',
  salesforce: 'rgba(0, 112, 210, 0.08)',
  writer: 'rgba(90, 70, 50, 0.06)',
  chorus: 'rgba(80, 70, 120, 0.08)',
} as const;

export const PORTFOLIO_INDEX_DEFAULT_ID = 'chase-ai-rcs';

export function getDefaultPortfolioIndexEntry(): PortfolioIndexEntry {
  return (
    PORTFOLIO_INDEX.find((entry) => entry.id === PORTFOLIO_INDEX_DEFAULT_ID) ??
    PORTFOLIO_INDEX[0]
  );
}

/**
 * Home index — labels and year grouping follow the 2026 Figma portfolio.
 * href/previewSlug map onto existing case studies and the Seb Sans page.
 */
export const PORTFOLIO_INDEX: PortfolioIndexEntry[] = [
  {
    id: 'memento-ai',
    year: 2026,
    label: 'Memento AI - Fully Private Journal',
    section: 'projects',
    href: '/work/memento-ai',
    previewSlug: 'memento-ai',
    tint: TINT.memento,
  },
  {
    id: 'seb-sans',
    year: 2026,
    label: 'Seb Sans - Custom Typeface',
    section: 'projects',
    href: '/seb-sans',
    kind: 'typeface',
    tint: TINT.type,
  },
  {
    id: 'chase-ai-servicing',
    year: 2026,
    label: 'Chase AI - Agentic Loan Servicing',
    section: 'work',
    href: '/work/agentic-home-lending',
    previewSlug: 'agentic-home-lending',
    tint: TINT.chase,
  },
  {
    id: 'chase-ai-internal',
    year: 2026,
    label: 'Chase AI - Internal Agentic Chatbot',
    section: 'work',
    previewSlug: 'casey-ai',
    tint: TINT.chase,
  },
  {
    id: 'chase-ai-flows',
    year: 2026,
    label: 'Chase AI - Home Lending Agentic Flows',
    section: 'work',
    href: '/work/agentic-home-lending',
    previewSlug: 'agentic-home-lending',
    tint: TINT.chase,
  },
  {
    id: 'chase-ai-rcs',
    year: 2026,
    label: 'Chase AI - Conversational RCS Agent',
    section: 'work',
    href: '/work/casey-ai',
    previewSlug: 'casey-ai',
    tint: TINT.chase,
  },
  {
    id: 'chase-ai-voice',
    year: 2025,
    label: 'Chase AI - Conversational Voice AI',
    section: 'work',
    href: '/work/casey-ai',
    previewSlug: 'casey-ai',
    tint: TINT.chase,
  },
  {
    id: 'cmh-landing',
    year: 2025,
    label: 'Chase MyHome - Landing Page',
    section: 'work',
    href: '/work/chase-myhome',
    previewSlug: 'chase-myhome',
    tint: TINT.chase,
  },
  {
    id: 'cmh-calculators',
    year: 2025,
    label: 'ChaseMyHome - Mortgage Calculators',
    section: 'work',
    previewSlug: 'chase-myhome',
    tint: TINT.chase,
  },
  {
    id: 'cmh-onboarding',
    year: 2024,
    label: 'ChaseMyHome - Onboarding',
    section: 'work',
    href: '/work/chase-myhome',
    previewSlug: 'chase-myhome',
    tint: TINT.chase,
  },
  {
    id: 'cmh-applications',
    year: 2024,
    label: 'ChaseMyHome - Mortgage Applications',
    section: 'work',
    href: '/work/chase-myhome',
    previewSlug: 'chase-myhome',
    tint: TINT.chase,
  },
  {
    id: 'sf-docs',
    year: 2023,
    label: 'Salesforce Help - Documentation',
    section: 'work',
    href: '/work/salesforce-help',
    previewSlug: 'salesforce-help',
    tint: TINT.salesforce,
  },
  {
    id: 'sf-contact',
    year: 2023,
    label: 'Salesforce Help - Contact Support',
    section: 'work',
    href: '/work/salesforce-help',
    previewSlug: 'salesforce-help',
    tint: TINT.salesforce,
  },
  {
    id: 'sf-pages',
    year: 2022,
    label: 'Salesforce - Customer Support Pages',
    section: 'work',
    href: '/work/salesforce-help',
    previewSlug: 'salesforce-help',
    tint: TINT.salesforce,
  },
  {
    id: 'sf-emails',
    year: 2022,
    label: 'Salesforce - Support emails',
    section: 'work',
    previewSlug: 'salesforce-help',
    tint: TINT.salesforce,
  },
  {
    id: 'writer-rewrite',
    year: 2021,
    label: 'WRITER AI - ReWrite',
    section: 'work',
    href: '/work/writer-ai',
    previewSlug: 'writer-ai',
    tint: TINT.writer,
  },
  {
    id: 'writer-ds',
    year: 2021,
    label: 'WRITER AI - Design Systems',
    section: 'work',
    href: '/work/writer-ai',
    previewSlug: 'writer-ai',
    tint: TINT.writer,
  },
  {
    id: 'chorus-ds',
    year: 2020,
    label: 'Chorus AI - Design Systems',
    section: 'work',
    href: '/work/chorus-ai',
    previewSlug: 'chorus-ai',
    tint: TINT.chorus,
  },
];
