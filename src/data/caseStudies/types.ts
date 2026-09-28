import type { PortfolioIndexSection } from '@/data/portfolioIndex';

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
  /** One item fills the well; two sit side by side (phones) or stack (browsers). */
  media: CaseStudyMedia[];
  caption?: string;
  /** `default` matches the homepage card well (600 / 564); `wide` suits browser shots. */
  shape?: 'default' | 'wide';
};

export type CaseStudyOutcome = {
  value: string;
  label: string;
};

export type CaseStudyConstraint = {
  title: string;
  body: string;
};

export type CaseStudyDecision = {
  title: string;
  body: string;
  tradeoff: string;
  rationale: string;
  figure?: CaseStudyFigure;
};

export type CaseStudyExploration = {
  title: string;
  body: string;
  verdict: 'shipped' | 'dropped' | 'evolved';
};

export type CaseStudyMetric = {
  value: string;
  label: string;
  /** Short qualifier, e.g. "pilot scope" or "first 30 days". */
  note?: string;
};

export type CaseStudyLink = {
  label: string;
  href: string;
};

export type CaseStudy = {
  slug: string;
  /** Homepage section; drives the app-icon logo. */
  section: PortfolioIndexSection;
  title: string;
  /** One line under the title. */
  summary: string;
  company: string;
  year: string;
  meta: {
    role: string;
    team: string;
    timeline: string;
    platform: string;
    impact: string;
  };
  hero: CaseStudyFigure;
  links?: CaseStudyLink[];
  /** Renders the Casey listen / text buttons under the meta block. */
  caseyActions?: boolean;
  tldr: {
    heading: string;
    body: string;
    outcomes: CaseStudyOutcome[];
  };
  problem: {
    heading: string;
    body: string[];
    quote?: string;
  };
  constraints: {
    heading: string;
    items: CaseStudyConstraint[];
  };
  decisions: {
    heading: string;
    intro?: string;
    items: CaseStudyDecision[];
  };
  explorations: {
    heading: string;
    intro?: string;
    items: CaseStudyExploration[];
    figure?: CaseStudyFigure;
  };
  finalDesign: {
    heading: string;
    body: string[];
    figures: CaseStudyFigure[];
  };
  results: {
    heading: string;
    metrics: CaseStudyMetric[];
    body: string[];
  };
  reflection: {
    heading: string;
    body: string[];
    next: string[];
  };
};

export const CASE_STUDY_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'constraints', label: 'Constraints' },
  { id: 'decisions', label: 'Key decisions' },
  { id: 'explorations', label: 'Explorations' },
  { id: 'final-design', label: 'Final design' },
  { id: 'results', label: 'Results' },
  { id: 'reflection', label: 'Reflection' },
] as const;

export type CaseStudySectionId = (typeof CASE_STUDY_SECTIONS)[number]['id'];
