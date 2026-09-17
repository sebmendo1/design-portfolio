import {
  createStreamCursor,
  streamDurationMs,
  streamWordDelay,
  WORD_INTERVAL_MS,
} from '@/lib/streaming-text';
import { groupPortfolioIndex } from '@/lib/portfolio-index';
import {
  SITE_SOCIAL_NAV,
  WORK_PAGE_BIO_CURRENT,
  WORK_PAGE_BIO_LEAD_PREFIX,
  WORK_PAGE_BIO_LINKS,
  WORK_PAGE_BIO_PREVIOUS_INTRO,
} from '@/lib/site';

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

export type IndexStreamPlan = {
  /** Every streamed word in the rail shares this total, so they ride one curve. */
  totalWords: number;
  intervalMs: number;
  headline: number;
  bio: number;
  bioParts: number[];
  /** Word offsets into the shared stream. */
  headings: Record<string, number>;
  years: Record<string, number>;
  items: Record<string, number>;
  footer: Record<string, number>;
  /** Wall-clock milliseconds, derived from the same curve. */
  wellFadeMs: number;
  themeMs: number;
  durationMs: number;
};

/**
 * The rail streams as one continuous run of words: headings, years, items and
 * footer links all sit on a single timeline, so nothing waits for the line
 * above it to finish. Headline and bio are the anchor and paint immediately.
 */
export function buildIndexStreamPlan(): IndexStreamPlan {
  const cursor = createStreamCursor();

  const headings: Record<string, number> = {};
  const years: Record<string, number> = {};
  const items: Record<string, number> = {};

  for (const section of groupPortfolioIndex()) {
    headings[section.id] = cursor.take(section.id);
    for (const group of section.years) {
      years[`${section.id}-${group.year}`] = cursor.take(String(group.year));
      for (const item of group.items) {
        items[item.id] = cursor.take(item.label);
      }
    }
  }

  const footer: Record<string, number> = {
    about: cursor.take('about'),
  };
  for (const link of SITE_SOCIAL_NAV) {
    footer[link.label] = cursor.take(link.label);
  }

  const totalWords = cursor.total;
  const durationMs = streamDurationMs(totalWords);

  return {
    totalWords,
    intervalMs: WORD_INTERVAL_MS,
    headline: 0,
    bio: 0,
    bioParts: INDEX_BIO_PARTS.map(() => 0),
    headings,
    years,
    items,
    footer,
    // The stage well rides in with the first words rather than after the rail.
    wellFadeMs: 0,
    themeMs: streamWordDelay(Math.max(0, totalWords - 1), totalWords),
    durationMs,
  };
}
