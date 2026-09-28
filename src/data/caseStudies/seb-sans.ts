import type { CaseStudy } from './types';

export const sebSans: CaseStudy = {
  slug: 'seb-sans',
  section: 'other',
  title: 'A typeface tuned for AI text that streams in word by word',
  summary: 'Seb Sans: a variable screen grotesque for AI interfaces, installable by people and coding agents.',
  company: 'Seb Sans · Personal project',
  year: '2026',
  meta: {
    role: 'Type designer and engineer, end to end',
    team: 'Solo: type design, installer CLI, and specimen site',
    timeline: '2026 · v0.7.2',
    platform: 'Variable font (web and desktop), npm CLI',
    status: 'Shipped',
  },
  hero: {
    media: [{ type: 'typeface', variant: 'hero', alt: 'Seb Sans specimen' }],
    caption: 'This whole portfolio is set in Seb Sans, from the nav pills to the paragraph you are reading.',
  },
  links: [
    { label: 'Try the specimen', href: '/seb-sans' },
    { label: 'Source on GitHub', href: 'https://github.com/sebmendo1/seb-sans' },
  ],
  tldr: {
    body: 'AI products are mostly generated text that people read for long sessions, and system fonts tire before the content does. I designed Seb Sans, a variable typeface derived from Inter and tuned for streamed prose at 13–16px. It ships with a non-interactive installer so coding agents can set it up too.',
    keyResult: {
      value: '652',
      label: 'glyphs across 3 axes and 9 named weights',
      context: 'v0.7.2, OFL-1.1',
      confidence: 'measured',
    },
  },
  context: {
    heading: 'Streaming text is read while it is still moving.',
    body: [
      'Answers arrive a few words at a time, reflow as they grow, and mix prose with code and tables. Type that looks fine in a static mock can shimmer and fatigue in a live transcript.',
      'Today, the font is often installed by a coding agent rather than a person, so the install path mattered as much as the letterforms.',
    ],
    constraints: ['Readable at 13–16px', 'Open license', 'Agent-safe installs'],
  },
  decisions: {
    heading: 'I optimized for the transcript, not the poster.',
    items: [
      {
        title: 'Start from Inter’s skeleton',
        body: 'I built on Inter’s open-source structure and spent the effort on rhythm, spacing, and weight for chat transcripts and summaries.',
        alternative: 'Drawing a new family from scratch.',
        // TODO(seb): verify.
        tradeoff: 'Seb Sans shares Inter’s bones, so it is less distinctive at display sizes.',
        figure: {
          media: [{ type: 'typeface', variant: 'weights', alt: 'Seb Sans weight range' }],
          caption: 'One variable file covers the full weight range. Six stops from 300 to 900, all from the same font file.',
        },
      },
      {
        title: 'Tune for streaming, not static pages',
        // TODO(seb): verify the streaming-specific tuning claims and the display-size trade-offs.
        body: 'Spacing and weight are set so a sentence holds its shape as words arrive and lines rewrap mid-read.',
        alternative: 'Tuning for large marketing headlines, where most typefaces are judged.',
        tradeoff: 'Big headlines need tighter manual tracking to look their best.',
        figure: {
          media: [{ type: 'typeface', variant: 'stream', alt: 'Streaming text set in Seb Sans' }],
          caption: 'Set at reading size with a live caret. Text that streams in should not jump when the next word lands.',
        },
      },
      {
        title: 'Make installation safe for agents',
        body: 'Every install path is non-interactive and idempotent, and ships a typography skill agents can read to apply the right weights and leading.',
        alternative: 'A zip download and a README for humans.',
        tradeoff: 'More engineering than a typical font release: a CLI, checksums, and a JSON manifest.',
        figure: {
          media: [{ type: 'typeface', variant: 'glyphs', alt: 'Seb Sans glyph sample' }],
          caption: 'Numerals, punctuation, and symbols get the same care as letters, because AI answers are full of them.',
        },
      },
    ],
  },
  result: {
    heading: 'Live on npm, and running this entire site.',
    metrics: [
      { value: '652', label: 'Glyphs', context: 'v0.7.2', confidence: 'measured' },
      { value: '3', label: 'Variable axes', context: 'v0.7.2', confidence: 'measured' },
      { value: '13–16px', label: 'Tuned UI range', context: 'design target', confidence: 'measured' },
    ],
    body: [
      'Seb Sans is published as seb-sans-font under the OFL-1.1 license, with a specimen, installer, and agent manifest at /seb-sans.',
    ],
  },
  reflection: {
    heading: 'Next: a mono companion for code in AI answers.',
    body: [
      // TODO(seb): verify this is on your roadmap.
      'Generated answers mix prose and code constantly. A matching monospace would keep that switch from feeling like two products.',
    ],
  },
};
