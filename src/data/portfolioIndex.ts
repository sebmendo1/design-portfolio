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

export type PortfolioIndexSection =
  | 'memento-ai'
  | 'chase-ai'
  | 'chase-home-lending'
  | 'salesforce'
  | 'writer-ai'
  | 'chorus-ai'
  | 'other';

export type PortfolioIndexKind = 'device' | 'typeface' | 'voice';

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
  /** One sentence for exports and screen readers. No dashes. */
  summary: string;
  /** Single line under the card title (about 60 characters at 15px in a 544px row). */
  description: string;
};

export const PORTFOLIO_INDEX_DEFAULT_ID = 'memento-ai';

export function getDefaultPortfolioIndexEntry(): PortfolioIndexEntry {
  return (
    PORTFOLIO_INDEX.find((entry) => entry.id === PORTFOLIO_INDEX_DEFAULT_ID) ??
    PORTFOLIO_INDEX[0]
  );
}

/**
 * Home feed — array order is feed order within each section.
 * href is the card destination. previewSlug still picks the screenshot.
 */
export const PORTFOLIO_INDEX: PortfolioIndexEntry[] = [
  {
    id: 'memento-ai',
    year: 2026,
    label: 'Memento AI - Fully Private Journal',
    section: 'memento-ai',
    href: '/work/memento-ai',
    previewSlug: 'memento-ai',
    summary:
      'Memento is a fully local AI journal that allows you to write and reflect in complete privacy.',
    description: 'A fully local AI journal for writing and reflecting in private',
  },
  {
    id: 'chase-ai-rcs',
    year: 2026,
    label: 'Chase AI - Agentic Conversational RCS',
    section: 'chase-ai',
    href: '/work/casey-ai',
    previewSlug: 'casey-ai',
    summary:
      'Casey RCS brings Chase’s customer facing AI agent to rich text messaging on iOS and Android.',
    description: 'Building a conversational RCS bot for consumer banking',
  },
  {
    id: 'chase-ai-voice',
    year: 2025,
    label: 'Chase AI - Voice Agent',
    section: 'chase-ai',
    href: '/work/casey-ai',
    kind: 'voice',
    summary:
      'Casey Voice is Chase’s first customer facing AI agent, answering home lending calls since July 2025.',
    description: 'Building Casey, Chase’s first ever consumer-facing AI agent',
  },
  {
    id: 'chase-ai-internal',
    year: 2026,
    label: 'Chase AI - Internal Agentic Chatbot',
    section: 'chase-ai',
    href: '/work/casey-ai',
    previewSlug: 'casey-ai',
    preview: CHASE_AI_INTERNAL_CHATBOT_PREVIEW,
    summary:
      'Built, shipped, and maintaining 20+ AI chat components for internal dashboard use cases.',
    description: 'Shipping 20+ AI chat components for internal dashboards',
  },
  {
    id: 'chase-ai-flows',
    year: 2026,
    label: 'Chase AI - Home Lending Agentic Flows',
    section: 'chase-ai',
    href: '/work/agentic-home-lending',
    previewSlug: 'agentic-home-lending',
    summary:
      'Designing a conversational AI experience for discovering your best home loan.',
    description: 'A conversational AI experience for finding your best home loan',
  },
  {
    id: 'chase-ai-servicing',
    year: 2026,
    label: 'Chase AI - Agentic Loan Servicing',
    section: 'chase-ai',
    href: '/work/agentic-home-lending',
    previewSlug: 'agentic-home-lending',
    summary:
      'Building an evaluations platform for measuring performance of Chase AI agents.',
    description: 'Agents that work on the customer’s behalf across their loan',
  },
  {
    id: 'cmh-calculators',
    year: 2025,
    label: 'Chase MyHome - Mortgage Calculators',
    section: 'chase-home-lending',
    href: 'https://www.chase.com',
    previewSlug: 'chase-myhome',
    preview: {
      frame: 'browser',
      src: '/assets/chase-myhome-calculators.png',
      url: 'chase.com',
      screenAspectRatio: CHASE_MYHOME_CALCULATORS_SCREEN_AR,
    },
    summary: 'Public tools that let people run the mortgage math before they apply.',
    description: 'Public tools for running the mortgage math before applying',
  },
  {
    id: 'cmh-landing',
    year: 2024,
    label: 'Chase MyHome - Landing Page',
    section: 'chase-home-lending',
    href: 'https://www.chase.com',
    previewSlug: 'chase-myhome',
    preview: CHASE_MYHOME_LANDING_PREVIEW,
    summary:
      'The Chase.com entry that introduces MyHome and routes people into rates, tools, and apply.',
    description: 'The Chase.com front door to rates, tools, and applying',
  },
  {
    id: 'cmh-applications',
    year: 2024,
    label: 'Chase MyHome - Mortgage Applications',
    section: 'chase-home-lending',
    href: '/work/chase-myhome',
    previewSlug: 'chase-myhome',
    summary: 'The in-app path for starting and completing a Chase mortgage application.',
    description: 'The in-app path for starting and finishing a mortgage',
  },
  {
    id: 'sf-contact',
    year: 2023,
    label: 'Salesforce Help - Contact Support',
    section: 'salesforce',
    href: '/work/salesforce-help',
    previewSlug: 'salesforce-help',
    summary:
      'Customers describe the issue in their own words and Einstein routes them to the best channel.',
    description: 'Einstein routes each customer to the best support channel',
  },
  {
    id: 'sf-pages',
    year: 2022,
    label: 'Salesforce Help - Home',
    section: 'salesforce',
    href: 'https://help.salesforce.com',
    previewSlug: 'salesforce-help',
    preview: {
      frame: 'browser',
      src: '/assets/salesforce-help-home.png',
      url: 'help.salesforce.com',
      screenAspectRatio: SALESFORCE_HELP_HOME_SCREEN_AR,
    },
    summary:
      'The Salesforce Help homepage that orients people before they pick a support path.',
    description: 'The homepage that orients people before they pick a path',
  },
  {
    id: 'sf-cases',
    year: 2022,
    label: 'Salesforce Help - Cases',
    section: 'salesforce',
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
    description: 'Where submitted support cases are tracked after routing',
  },
  {
    id: 'writer-rewrite',
    year: 2021,
    label: 'WRITER AI - ReWrite',
    section: 'writer-ai',
    href: 'https://writer.com',
    previewSlug: 'writer-ai',
    summary:
      'Highlight text, pick a rewrite mode, and insert the result across the editor, apps, extensions, and Figma.',
    description: 'Highlight text, pick a mode, and insert a rewrite anywhere',
  },
  {
    id: 'writer-ds',
    year: 2021,
    label: 'WRITER AI - Page Editor',
    section: 'writer-ai',
    href: 'https://writer.com',
    previewSlug: 'writer-ai',
    preview: WRITER_PAGE_EDITOR_PREVIEW,
    summary: 'The WRITER page editor where teams draft and govern enterprise content.',
    description: 'The editor where teams draft and govern enterprise content',
  },
  {
    id: 'chorus-ds',
    year: 2020,
    label: 'Chorus AI - Design Systems',
    section: 'chorus-ai',
    href: 'https://www.chorus.ai',
    previewSlug: 'chorus-ai',
    summary:
      'A rebuilt design system that standardized Chorus UI ahead of the ZoomInfo acquisition.',
    description: 'A rebuilt design system ahead of the ZoomInfo acquisition',
  },
  {
    id: 'seb-sans',
    year: 2026,
    label: 'Seb Sans - Custom Typeface',
    section: 'other',
    href: '/work/seb-sans',
    kind: 'typeface',
    summary:
      'Seb Sans is a variable typeface tuned so AI generated answers, drafts, and streamed UI copy stay easy to read.',
    description: 'A variable typeface tuned for streamed AI text',
  },
];
