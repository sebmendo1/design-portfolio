import type { PortfolioIndexSection } from '@/data/portfolioIndex';

/**
 * Content model follows `.claude/skills/scannable-case-studies/SKILL.md`:
 * claim title → meta row → TL;DR → why it was hard → 2–3 decisions → result → reflection.
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
  /** Renders the Casey listen / text buttons under the meta row. */
  caseyActions?: boolean;
  /**
   * STAR summary, one sentence per field, read as one paragraph in the
   * sidebar. 60 words and 4 sentences or fewer in total.
   */
  tldr: {
    situation: string;
    task: string;
    action: string;
    result: string;
    keyResult?: CaseStudyMetric;
  };
  context: {
    heading: string;
    body: string[];
    constraints?: string[];
  };
  decisions: {
    heading: string;
    items: CaseStudyDecision[];
  };
  /** AI work: the state map, including failure and handoff. */
  behavior?: {
    heading: string;
    intro?: string;
    states: CaseStudyAgentState[];
  };
  shipped?: {
    heading: string;
    body?: string;
    figures: CaseStudyFigure[];
  };
  result: {
    heading: string;
    metrics: CaseStudyMetric[];
    body: string[];
  };
  reflection?: {
    heading: string;
    body: string[];
  };
};

export type CaseStudySection = { id: string; label: string };

export function getTldrSentences(study: CaseStudy): string[] {
  const { situation, task, action, result } = study.tldr;
  return [situation, task, action, result];
}

export function getTldrText(study: CaseStudy): string {
  return getTldrSentences(study).join(' ');
}

export function getCaseStudySections(study: CaseStudy): CaseStudySection[] {
  return [
    { id: 'overview', label: 'Overview' },
    { id: 'context', label: 'Why it was hard' },
    { id: 'decisions', label: 'Decisions' },
    ...(study.behavior ? [{ id: 'behavior', label: 'How it behaves' }] : []),
    ...(study.shipped ? [{ id: 'shipped', label: 'What shipped' }] : []),
    { id: 'result', label: 'Result' },
    ...(study.reflection ? [{ id: 'reflection', label: 'Reflection' }] : []),
  ];
}
