import {
  createStreamCursor,
  streamDurationMs,
  streamWordDelay,
  WORD_INTERVAL_MS,
} from '@/lib/streaming-text';
import { PROFILE } from '@/data/profile';
import {
  SITE_SOCIAL_NAV,
  WORK_PAGE_BIO_CURRENT,
  WORK_PAGE_BIO_LINKS,
} from '@/lib/site';

export const ABOUT_HEADLINE_TEXT = 'SebMendoDesign';

export const ABOUT_COMPANY_LINKS = [
  WORK_PAGE_BIO_CURRENT,
  ...WORK_PAGE_BIO_LINKS,
  { label: 'SpaceXAI', href: 'https://cursor.com' },
] as const;

export type AboutTextPart =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; href: string };

const ABOUT_COMPANY_PATTERN = new RegExp(
  `(${ABOUT_COMPANY_LINKS.map((company) =>
    company.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  ).join('|')})`,
  'g',
);

export function splitAboutText(text: string): AboutTextPart[] {
  const parts: AboutTextPart[] = [];

  for (const part of text.split(ABOUT_COMPANY_PATTERN)) {
    if (!part) continue;
    const company = ABOUT_COMPANY_LINKS.find((item) => item.label === part);
    if (company) {
      parts.push({ type: 'link', text: company.label, href: company.href });
    } else {
      parts.push({ type: 'text', text: part });
    }
  }

  return parts;
}

export const ABOUT_INTRO_BLOCKS = [
  { key: 'title', parts: splitAboutText(PROFILE.aboutIntro.title) },
  ...PROFILE.aboutIntro.paragraphs.map((paragraph, index) => ({
    key: `paragraph-${index}`,
    parts: splitAboutText(paragraph),
  })),
] as const;

export type AboutStreamPlan = {
  totalWords: number;
  intervalMs: number;
  headline: number;
  /** Word offsets into the shared stream, per block then per part. */
  blocks: number[][];
  footer: Record<string, number>;
  themeMs: number;
  durationMs: number;
};

/**
 * Headline and title are the anchor and paint immediately. Everything after
 * them — every paragraph and footer link — rides one continuous word stream,
 * so paragraphs bleed into each other instead of queueing up.
 */
export function buildAboutStreamPlan(): AboutStreamPlan {
  const cursor = createStreamCursor();

  const blocks = ABOUT_INTRO_BLOCKS.map((block) =>
    block.key === 'title'
      ? block.parts.map(() => 0)
      : block.parts.map((part) => cursor.take(part.text)),
  );

  const footer: Record<string, number> = {
    work: cursor.take('work'),
  };
  for (const link of SITE_SOCIAL_NAV) {
    footer[link.label] = cursor.take(link.label);
  }

  const totalWords = cursor.total;

  return {
    totalWords,
    intervalMs: WORD_INTERVAL_MS,
    headline: 0,
    blocks,
    footer,
    themeMs: streamWordDelay(Math.max(0, totalWords - 1), totalWords),
    durationMs: streamDurationMs(totalWords),
  };
}
