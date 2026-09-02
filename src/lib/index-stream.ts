import { splitIntoUnits, WORD_ANIMATION_MS } from '@/lib/streaming-text';
import { groupPortfolioIndex } from '@/lib/portfolio-index';
import {
  SITE_SOCIAL_NAV,
  WORK_PAGE_BIO_CURRENT,
  WORK_PAGE_BIO_LEAD_PREFIX,
  WORK_PAGE_BIO_LINKS,
  WORK_PAGE_BIO_PREVIOUS_INTRO,
} from '@/lib/site';

const SECTION_GAP_MS = 32;
const INDEX_STREAM_TARGET_MS = 5000;

export const INDEX_HEADLINE_TEXT = 'SebMendoDesign';

export type IndexBioPart =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; href: string }
  | { type: 'gap' };

export const INDEX_BIO_PARTS: IndexBioPart[] = [
  { type: 'text', text: WORK_PAGE_BIO_LEAD_PREFIX },
  {
    type: 'link',
    text: WORK_PAGE_BIO_CURRENT.label,
    href: WORK_PAGE_BIO_CURRENT.href,
  },
  { type: 'text', text: WORK_PAGE_BIO_PREVIOUS_INTRO },
  {
    type: 'link',
    text: WORK_PAGE_BIO_LINKS[0].label,
    href: WORK_PAGE_BIO_LINKS[0].href,
  },
  { type: 'text', text: ', ' },
  {
    type: 'link',
    text: WORK_PAGE_BIO_LINKS[1].label,
    href: WORK_PAGE_BIO_LINKS[1].href,
  },
  { type: 'gap' },
  { type: 'text', text: 'and ' },
  {
    type: 'link',
    text: WORK_PAGE_BIO_LINKS[2].label,
    href: WORK_PAGE_BIO_LINKS[2].href,
  },
  { type: 'text', text: '.' },
];

export type IndexStreamDelays = {
  intervalMs: number;
  headline: number;
  bio: number;
  bioParts: number[];
  wellFade: number;
  headings: Record<string, number>;
  years: Record<string, number>;
  items: Record<string, number>;
  footer: Record<string, number>;
  theme: number;
};

function wordCount(text: string) {
  return splitIntoUnits(text).length;
}

function indexStreamBlocks() {
  const bio = INDEX_BIO_PARTS.filter((part) => part.type !== 'gap').map((part) => part.text);
  const afterBio: string[] = [];

  for (const section of groupPortfolioIndex()) {
    afterBio.push(section.id);
    for (const group of section.years) {
      afterBio.push(String(group.year));
      for (const item of group.items) afterBio.push(item.label);
    }
  }

  afterBio.push('about');
  for (const link of SITE_SOCIAL_NAV) afterBio.push(link.label);

  return { headline: INDEX_HEADLINE_TEXT, bio, afterBio };
}

function indexWordIntervalMs() {
  const { headline, bio, afterBio } = indexStreamBlocks();
  const words = [headline, ...bio, ...afterBio].reduce((count, text) => count + wordCount(text), 0);
  const gapsBeforeLast = 2 + Math.max(0, afterBio.length - 1);
  const budget = INDEX_STREAM_TARGET_MS - WORD_ANIMATION_MS;
  const remaining = budget - gapsBeforeLast * SECTION_GAP_MS;
  return Math.max(12, Math.round(remaining / Math.max(1, words - 1)));
}

export function buildIndexStreamDelays(): IndexStreamDelays {
  const intervalMs = indexWordIntervalMs();
  let cursor = 0;

  const take = (text: string, gapMs = SECTION_GAP_MS) => {
    const start = cursor;
    cursor += wordCount(text) * intervalMs + gapMs;
    return start;
  };

  const headline = take(INDEX_HEADLINE_TEXT);

  const bio = cursor;
  const bioParts = INDEX_BIO_PARTS.map((part) => {
    const start = cursor;
    if (part.type !== 'gap') {
      cursor += wordCount(part.text) * intervalMs;
    }
    return start;
  });
  cursor += SECTION_GAP_MS;

  const wellFade = cursor;

  const headings: Record<string, number> = {};
  const years: Record<string, number> = {};
  const items: Record<string, number> = {};

  for (const section of groupPortfolioIndex()) {
    headings[section.id] = take(section.id);
    for (const group of section.years) {
      years[`${section.id}-${group.year}`] = take(String(group.year));
      for (const item of group.items) {
        items[item.id] = take(item.label);
      }
    }
  }

  const footer: Record<string, number> = {
    about: take('about'),
  };
  for (const link of SITE_SOCIAL_NAV) {
    footer[link.label] = take(link.label);
  }

  return {
    intervalMs,
    headline,
    bio,
    bioParts,
    wellFade,
    headings,
    years,
    items,
    footer,
    theme: footer.about,
  };
}
