import type { PortfolioIndexSection } from '@/data/portfolioIndex';

/**
 * Content model follows `.claude/skills/scannable-case-studies/SKILL.md`,
 * styled like a Cursor research post: claim title → byline → hero → lede →
 * problem → why it matters → decisions → how it works → impact → reflection.
 */

export type CaseStudyMedia =
  | {
      type: 'phone';
      src?: string;
      video?: string;
      alt: string;
    }
  | {
      type: 'browser';
      src?: string;
      video?: string;
      url?: string;
      screenAspectRatio?: number;
      alt: string;
    }
  | {
      type: 'image';
      src: string;
      width: number;
      height: number;
      alt: string;
    }
  | { type: 'voice'; alt: string }
  | { type: 'typeface'; variant: 'hero' | 'weights' | 'stream' | 'glyphs'; alt: string };

export type CaseStudyFigure = {
  /** One item fills the well; two phones sit side by side, anything else stacks. */
  media: CaseStudyMedia[];
  /** Argues the point in 25 words or fewer. */
  caption: string;
  /** `default` matches the homepage card well (600 / 564); `wide` suits browser shots. */
  shape?: 'default' | 'wide';
};

/** How sure we are of a number; rendered next to it. */
export type MetricConfidence = 'measured' | 'estimated' | 'directional';

export type CaseStudyMetric = {
  value: string;
  label: string;
  /** Baseline, timeframe, and scope in a few words, e.g. "from 18%, application flow". */
  context?: string;
  confidence?: MetricConfidence;
};

export type CaseStudyDecision = {
  /** Claim headline. */
  title: string;
  /** What I picked and why. */
  body: string;
  /** The option we did not take. */
  alternative: string;
  tradeoff: string;
  figure?: CaseStudyFigure;
};

export type CaseStudyAgentState = {
  state: string;
  behavior: string;
};

export type CaseStudyLink = {
  label: string;
  href: string;
};

export type CaseStudyStatus = 'Shipped' | 'Pilot' | 'Concept' | 'In beta' | 'In progress';

export type CaseStudy = {
  slug: string;
  /** Homepage section; drives the app-icon logo. */
  section: PortfolioIndexSection;
  /** The outcome as a claim, 12 words or fewer. */
  title: string;
  /** One line for the next-study card and meta description. */
  summary: string;
  company: string;
  year: string;
  meta: {
    role: string;
    team: string;
    timeline: string;
    platform: string;
    status: CaseStudyStatus;
  };
  hero: CaseStudyFigure;
  links?: CaseStudyLink[];
  /** Renders the Casey listen / text buttons under the hero. */
  caseyActions?: boolean;
  /**
   * Opening paragraphs after the hero: problem → what I did → result.
   * 2–3 paragraphs, ≤80 words total. Wrap the one key number in `**…**`.
   */
  lede: string[];
  /**
   * STAR summary kept for machine-readable exports and tests.
   * Not rendered on the study page (the lede carries that job).
   */
  tldr: {
    situation: string;
    task: string;
    action: string;
    result: string;
    keyResult?: CaseStudyMetric;
  };
  /** What was broken, and the constraints any fix had to respect. */
  problem: {
    heading: string;
    body: string[];
    /** Kept as source notes; the page folds these into First/Second/Third prose. */
    constraints?: string[];
  };
  /** What was at stake for customers and the business. */
  whyItMatters: {
    heading: string;
    body: string[];
  };
  decisions: {
    heading: string;
    items: CaseStudyDecision[];
  };
  /** The state map for AI work (including failure and handoff) and the shipped screens. */
  howItWorks?: {
    heading: string;
    intro?: string;
    states?: CaseStudyAgentState[];
    figures?: CaseStudyFigure[];
  };
  impact: {
    heading: string;
    metrics: CaseStudyMetric[];
    body: string[];
  };
  reflection?: {
    heading: string;
    body: string[];
  };
};

export type CaseStudySectionId =
  | 'overview'
  | 'problem'
  | 'why-it-matters'
  | 'decisions'
  | 'how-it-works'
  | 'impact'
  | 'reflection';

export type CaseStudySection = { id: CaseStudySectionId; label: string };

/** Shared by the "On this page" nav. In-page sections use claim headings only. */
export const CASE_STUDY_SECTION_LABELS: Record<CaseStudySectionId, string> = {
  overview: 'Overview',
  problem: 'Problem',
  'why-it-matters': 'Why it matters',
  decisions: 'Key decisions',
  'how-it-works': 'How it works',
  impact: 'Impact',
  reflection: 'Reflection',
};

export function getTldrSentences(study: CaseStudy): string[] {
  const { situation, task, action, result } = study.tldr;
  return [situation, task, action, result];
}

export function getTldrText(study: CaseStudy): string {
  return getTldrSentences(study).join(' ');
}

export function getCaseStudySections(study: CaseStudy): CaseStudySection[] {
  const ids: CaseStudySectionId[] = [
    'overview',
    'problem',
    'why-it-matters',
    'decisions',
    ...(study.howItWorks ? (['how-it-works'] as const) : []),
    'impact',
    ...(study.reflection ? (['reflection'] as const) : []),
  ];
  return ids.map((id) => ({ id, label: CASE_STUDY_SECTION_LABELS[id] }));
}
