import type { CaseStudy } from './types';

export const sebSans: CaseStudy = {
  slug: 'seb-sans',
  section: 'other',
  title: 'A typeface tuned for AI text that streams in word by word',
  summary: 'Seb Sans: a variable sans-serif for AI interfaces that people and coding agents can install.',
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
    caption: 'This portfolio is set in Seb Sans, including the text you are reading now.',
  },
  links: [
    { label: 'Try the specimen', href: '/seb-sans' },
    { label: 'Source on GitHub', href: 'https://github.com/sebmendo1/seb-sans' },
  ],
  tldr: {
    situation: 'People read AI-generated text for long sessions, often while it is still streaming in.',
    task: 'I wanted a typeface tuned for streamed prose at 13–16px.',
    action: 'I designed Seb Sans, a variable font derived from Inter, with an installer coding agents can run.',
    result: 'v0.7.2 ships 652 glyphs across 3 axes and 9 named weights.',
    keyResult: {
      value: '652',
      label: 'glyphs across 3 axes and 9 named weights',
      context: 'v0.7.2, OFL-1.1',
      confidence: 'measured',
    },
  },
  problem: {
    heading: 'AI answers are read while the text is still arriving.',
    body: [
      'Answers arrive a few words at a time, rewrap as they grow, and mix prose with code and tables. Type that works in a static mockup can feel unsteady in a live transcript.',
    ],
    constraints: ['Readable at 13–16px', 'Open license', 'Safe for agents to install'],
  },
  whyItMatters: {
    heading: 'People read AI answers for long sessions, and agents now install the fonts.',
    body: [
      'Spacing that is slightly off becomes tiring over a long transcript. Coding agents often install fonts now, so the install path mattered as much as the letterforms.',
    ],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'I tuned Seb Sans for long chat transcripts at reading size.',
    items: [
      {
        title: 'Start from Inter’s structure',
        body: 'I built on Inter’s open-source outlines and spent my time on rhythm, spacing, and weight for chat transcripts and summaries.',
        alternative: 'Drawing a new family from scratch.',
        // TODO(seb): verify the display-size trade-off against Inter.
        tradeoff: 'Seb Sans shares Inter’s structure, so it looks less distinctive at display sizes.',
        figure: {
          media: [{ type: 'typeface', variant: 'weights', alt: 'Seb Sans weight range' }],
          caption: 'One variable file covers the whole weight range, shown here in six stops from 300 to 900.',
        },
      },
      {
        title: 'Tune spacing for streaming text',
        // TODO(seb): verify the streaming-specific tuning claims and the display-size trade-offs.
        body: 'I set spacing and weights so lines keep their shape as new words arrive and the text rewraps.',
        alternative: 'Tuning for large marketing headlines, where most typefaces are judged.',
        tradeoff: 'Large headlines need tighter manual tracking to look their best.',
        figure: {
          media: [{ type: 'typeface', variant: 'stream', alt: 'Streaming text set in Seb Sans' }],
          caption: 'Set at reading size with a live caret. Lines should not jump when the next word arrives.',
        },
      },
      {
        title: 'Make installs safe for agents',
        body: 'Every install path runs without prompts and is safe to run twice. It also ships a typography skill that agents read to apply the right weights and line height.',
        alternative: 'A zip download and a README for humans.',
        tradeoff: 'More engineering than a typical font release: a CLI, checksums, and a JSON manifest.',
        figure: {
          media: [{ type: 'typeface', variant: 'glyphs', alt: 'Seb Sans glyph sample' }],
          caption: 'Numerals, punctuation, and symbols get the same attention as letters, since AI answers use them constantly.',
        },
      },
    ],
  },
  impact: {
    heading: 'Published on npm and used across this site.',
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
    heading: 'Next: a matching monospace for code in AI answers.',
    body: [
      // TODO(seb): verify this is on your roadmap.
      'AI answers switch between prose and code all the time. A matching monospace would make that switch less jarring.',
    ],
  },
};
