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

/** Everything a reader sees below the meta row, excluding captions and metric tiles. */
export function getBodyText(study: CaseStudy): string[] {
  return [
    study.context.heading,
    ...study.context.body,
    study.decisions.heading,
    ...study.decisions.items.flatMap((item) => [item.title, item.body, item.alternative, item.tradeoff]),
    ...(study.behavior
      ? [
          study.behavior.heading,
          study.behavior.intro ?? '',
          ...study.behavior.states.flatMap((item) => [item.state, item.behavior]),
        ]
      : []),
    ...(study.shipped ? [study.shipped.heading, study.shipped.body ?? ''] : []),
    study.result.heading,
    ...study.result.body,
    ...(study.reflection ? [study.reflection.heading, ...study.reflection.body] : []),
  ];
}

export function getCaptions(study: CaseStudy): string[] {
  return [
    study.hero.caption,
    ...study.decisions.items.flatMap((item) => (item.figure ? [item.figure.caption] : [])),
    ...(study.shipped?.figures.map((figure) => figure.caption) ?? []),
  ];
}

export function getBodyWordCount(study: CaseStudy): number {
  return getBodyText(study).reduce((total, text) => total + countWords(text), 0);
}
