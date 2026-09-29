import type { CaseStudy } from '@/data/caseStudies/types';

/** Words the scannable-case-studies skill bans from case study copy. */
export const BANNED_WORDS = [
  'leveraged',
  'leverage',
  'seamless',
  'seamlessly',
  'delightful',
  'delighted',
  'holistic',
  'robust',
  'user-centric',
  'empower',
  'empowered',
  'meaningful experiences',
];

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Sentence-ending punctuation followed by whitespace or the end, so "v0.7.2" stays one sentence. */
export function countSentences(text: string): number {
  return text.match(/[.!?](?=\s|$)/g)?.length ?? 0;
}

/** Strip `**bold**` markers before counting words. */
export function stripMarkdownBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

/** Everything a reader sees below the hero, excluding captions and metric tiles. */
export function getBodyText(study: CaseStudy): string[] {
  return [
    ...study.lede.map(stripMarkdownBold),
    study.problem.heading,
    ...study.problem.body,
    study.whyItMatters.heading,
    ...study.whyItMatters.body,
    study.decisions.heading,
    ...study.decisions.items.flatMap((item) => [item.title, item.body, item.alternative, item.tradeoff]),
    ...(study.howItWorks
      ? [
          study.howItWorks.heading,
          study.howItWorks.intro ?? '',
          ...(study.howItWorks.states ?? []).flatMap((item) => [item.state, item.behavior]),
        ]
      : []),
    study.impact.heading,
    ...study.impact.body,
    ...(study.reflection ? [study.reflection.heading, ...study.reflection.body] : []),
  ];
}

export function getCaptions(study: CaseStudy): string[] {
  return [
    study.hero.caption,
    ...study.decisions.items.flatMap((item) => (item.figure ? [item.figure.caption] : [])),
    ...(study.howItWorks?.figures?.map((figure) => figure.caption) ?? []),
  ];
}

export function getBodyWordCount(study: CaseStudy): number {
  return getBodyText(study).reduce((total, text) => total + countWords(text), 0);
}

/** Approximate read time for the byline, rounded up at 200 words per minute. */
export function getReadMinutes(study: CaseStudy): number {
  return Math.max(1, Math.ceil(getBodyWordCount(study) / 200));
}

export function getLedeWordCount(study: CaseStudy): number {
  return study.lede.reduce((total, text) => total + countWords(stripMarkdownBold(text)), 0);
}

export function countLedeBoldSpans(study: CaseStudy): number {
  return study.lede.reduce((total, text) => total + (text.match(/\*\*[^*]+\*\*/g)?.length ?? 0), 0);
}
