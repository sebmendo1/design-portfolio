import { caseyAi } from './casey-ai';
import type { CaseStudy } from './types';

export type { CaseStudy } from './types';

/** Reading order for the "next case study" link; matches the homepage feed. */
export const CASE_STUDIES: CaseStudy[] = [caseyAi];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function getNextCaseStudy(slug: string): CaseStudy | undefined {
  const index = CASE_STUDIES.findIndex((study) => study.slug === slug);
  if (index === -1 || CASE_STUDIES.length < 2) return undefined;
  return CASE_STUDIES[(index + 1) % CASE_STUDIES.length];
}
