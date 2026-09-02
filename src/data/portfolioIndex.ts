import type { ProjectPreview } from '@/data/projects';
import {
  CHASE_AI_INTERNAL_CHATBOT_SCREEN_AR,
  CHASE_MYHOME_CALCULATORS_SCREEN_AR,
  CHASE_MYHOME_LANDING_SCREEN_AR,
  SALESFORCE_HELP_CASES_SCREEN_AR,
  SALESFORCE_HELP_HOME_SCREEN_AR,
  WRITER_PAGE_EDITOR_SCREEN_AR,
} from '@/components/BrowserStencil/browser-aspect-ratios';

/** Desktop landing-page screenshot for the Chase MyHome — Landing Page index row. */
export const CHASE_MYHOME_LANDING_PREVIEW: ProjectPreview = {
  frame: 'browser',
  src: '/assets/chase-myhome-landing.png',
  url: 'chase.com',
  screenAspectRatio: CHASE_MYHOME_LANDING_SCREEN_AR,
};

/** Desktop screenshot for the Chase AI — Internal Agentic Chatbot index row. */
export const CHASE_AI_INTERNAL_CHATBOT_PREVIEW: ProjectPreview = {
  frame: 'browser',
  src: '/assets/chase-ai-internal-chatbot.png',
  url: 'chase.com',
  screenAspectRatio: CHASE_AI_INTERNAL_CHATBOT_SCREEN_AR,
};

/** Desktop screenshot for the WRITER AI — Page Editor index row. */
export const WRITER_PAGE_EDITOR_PREVIEW: ProjectPreview = {
  frame: 'browser',
  src: '/assets/writer-page-editor.png',
  url: 'writer.com',
  screenAspectRatio: WRITER_PAGE_EDITOR_SCREEN_AR,
};

export type PortfolioIndexSection = 'projects' | 'work';

export type PortfolioIndexKind = 'device' | 'typeface';

export type PortfolioIndexEntry = {
  id: string;
  year: number;
  label: string;
  section: PortfolioIndexSection;
  href?: string;
  previewSlug?: string;
  /** Overrides the case-study preview for this index row. */
  preview?: ProjectPreview;
  kind?: PortfolioIndexKind;
  /** One sentence for the index well. No dashes. */
  summary: string;
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

export const PORTFOLIO_INDEX_DEFAULT_ID = 'memento-ai';

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
    summary:
      'Memento is a fully local AI journal that allows you to write and reflect in complete privacy.',
    tint: TINT.memento,
  },
  {
    id: 'seb-sans',
    year: 2026,
    label: 'Seb Sans - Custom Typeface',
    section: 'projects',
    href: '/seb-sans',
    kind: 'typeface',
    summary:
      'Seb Sans is a variable typeface tuned so AI generated answers, drafts, and streamed UI copy stay easy to read.',
    tint: TINT.type,
  },
  {
    id: 'chase-ai-servicing',
    year: 2026,
    label: 'Chase AI - Agentic Loan Servicing',
    section: 'work',
    href: '/work/agentic-home-lending',
    previewSlug: 'agentic-home-lending',
    summary:
      'Building an evaluations platform for measuring performance of Chase AI agents.',
    tint: TINT.chase,
  },
  {
    id: 'chase-ai-internal',
    year: 2026,
    label: 'Chase AI - Internal Agentic Chatbot',
    section: 'work',
    href: '/work/casey-ai',
    previewSlug: 'casey-ai',
    preview: CHASE_AI_INTERNAL_CHATBOT_PREVIEW,
    summary:
      'Built, shipped, and maintaining 20+ AI chat components for internal dashboard use cases.',
    tint: TINT.chase,
  },
  {
    id: 'chase-ai-flows',
    year: 2026,
    label: 'Chase AI - Home Lending Agentic Flows',
    section: 'work',
    href: '/work/agentic-home-lending',
    previewSlug: 'agentic-home-lending',
    summary:
      'Designing a conversational AI experience for discovering your best home loan.',
    tint: TINT.chase,
  },
  {
    id: 'chase-ai-rcs',
    year: 2025,
    label: 'Chase AI - Conversational Agent, Voice & RCS',
    section: 'work',
    href: '/work/casey-ai',
    previewSlug: 'casey-ai',
    summary:
      'Casey is Chase’s first customer facing AI agent, talking with people by voice and text in home lending.',
    tint: TINT.chase,
  },
  {
    id: 'cmh-calculators',
    year: 2025,
    label: 'Chase MyHome - Mortgage Calculators',
    section: 'work',
    href: '/work/chase-myhome',
    previewSlug: 'chase-myhome',
    preview: {
      frame: 'browser',
      src: '/assets/chase-myhome-calculators.png',
      url: 'chase.com',
      screenAspectRatio: CHASE_MYHOME_CALCULATORS_SCREEN_AR,
    },
    summary: 'Public tools that let people run the mortgage math before they apply.',
    tint: TINT.chase,
  },
  {
    id: 'cmh-landing',
    year: 2024,
    label: 'Chase MyHome - Landing Page',
    section: 'work',
    href: '/work/chase-myhome',
    previewSlug: 'chase-myhome',
    preview: CHASE_MYHOME_LANDING_PREVIEW,
    summary:
      'The Chase.com entry that introduces MyHome and routes people into rates, tools, and apply.',
    tint: TINT.chase,
  },
  {
    id: 'cmh-applications',
    year: 2024,
    label: 'Chase MyHome - Mortgage Applications',
    section: 'work',
    href: '/work/chase-myhome',
    previewSlug: 'chase-myhome',
    summary: 'The in-app path for starting and completing a Chase mortgage application.',
    tint: TINT.chase,
  },
  {
    id: 'sf-contact',
    year: 2023,
    label: 'Salesforce Help - Contact Support',
    section: 'work',
    href: '/work/salesforce-help',
    previewSlug: 'salesforce-help',
    summary:
      'Customers describe the issue in their own words and Einstein routes them to the best channel.',
    tint: TINT.salesforce,
  },
  {
    id: 'sf-pages',
    year: 2022,
    label: 'Salesforce Help - Home',
    section: 'work',
    href: '/work/salesforce-help',
    previewSlug: 'salesforce-help',
    preview: {
      frame: 'browser',
      src: '/assets/salesforce-help-home.png',
      url: 'help.salesforce.com',
      screenAspectRatio: SALESFORCE_HELP_HOME_SCREEN_AR,
    },
    summary:
      'The Salesforce Help homepage that orients people before they pick a support path.',
    tint: TINT.salesforce,
  },
  {
    id: 'sf-cases',
    year: 2022,
    label: 'Salesforce Help - Cases',
    section: 'work',
    href: '/work/salesforce-help',
    previewSlug: 'salesforce-help',
    preview: {
      frame: 'browser',
      src: '/assets/salesforce-help-cases.png',
      url: 'help.salesforce.com',
      screenAspectRatio: SALESFORCE_HELP_CASES_SCREEN_AR,
    },
    summary:
      'The Salesforce Help case surface where submitted issues are tracked after routing.',
    tint: TINT.salesforce,
  },
  {
    id: 'writer-rewrite',
    year: 2021,
    label: 'WRITER AI - ReWrite',
    section: 'work',
    href: '/work/writer-ai',
    previewSlug: 'writer-ai',
    summary:
      'Highlight text, pick a rewrite mode, and insert the result across the editor, apps, extensions, and Figma.',
    tint: TINT.writer,
  },
  {
    id: 'writer-ds',
    year: 2021,
    label: 'WRITER AI - Page Editor',
    section: 'work',
    href: '/work/writer-ai',
    previewSlug: 'writer-ai',
    preview: WRITER_PAGE_EDITOR_PREVIEW,
    summary: 'The WRITER page editor where teams draft and govern enterprise content.',
    tint: TINT.writer,
  },
  {
    id: 'chorus-ds',
    year: 2020,
    label: 'Chorus AI - Design Systems',
    section: 'work',
    href: '/work/chorus-ai',
    previewSlug: 'chorus-ai',
    summary:
      'A rebuilt design system that standardized Chorus UI ahead of the ZoomInfo acquisition.',
    tint: TINT.chorus,
  },
];
