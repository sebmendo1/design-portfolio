import { splitIntoUnits, WORD_INTERVAL_MS } from '@/lib/streaming-text';
import { PROFILE } from '@/data/profile';
import {
  SITE_SOCIAL_NAV,
  WORK_PAGE_BIO_CURRENT,
  WORK_PAGE_BIO_LINKS,
} from '@/lib/site';

const SECTION_GAP_MS = 32;

export const ABOUT_HEADLINE_TEXT = 'SebMendoDesign';

export const ABOUT_COMPANY_LINKS = [
  WORK_PAGE_BIO_CURRENT,
  ...WORK_PAGE_BIO_LINKS,
  { label: 'Cursor', href: 'https://cursor.com' },
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

export type AboutStreamDelays = {
  intervalMs: number;
  headline: number;
  blocks: number[][];
  footer: Record<string, number>;
  theme: number;
};

function wordCount(text: string) {
  return splitIntoUnits(text).length;
}

export function buildAboutStreamDelays(): AboutStreamDelays {
  const intervalMs = WORD_INTERVAL_MS;
  let cursor = 0;

  const take = (text: string, gapMs = SECTION_GAP_MS) => {
    const start = cursor;
    cursor += wordCount(text) * intervalMs + gapMs;
    return start;
  };

  const headline = take(ABOUT_HEADLINE_TEXT);

  const blocks = ABOUT_INTRO_BLOCKS.map((block) => {
    const partDelays = block.parts.map((part) => {
      const start = cursor;
      cursor += wordCount(part.text) * intervalMs;
      return start;
    });
    cursor += SECTION_GAP_MS;
    return partDelays;
  });

  const footer: Record<string, number> = {
    work: take('work'),
  };
  for (const link of SITE_SOCIAL_NAV) {
    footer[link.label] = take(link.label);
  }

  return {
    intervalMs,
    headline,
    blocks,
    footer,
    theme: footer.work,
  };
}
