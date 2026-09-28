import { ASSETS } from '@/data/assets';
import {
  WRITER_PAGE_EDITOR_SCREEN_AR,
  WRITER_REWRITE_SCREEN_AR,
} from '@/components/BrowserStencil/browser-aspect-ratios';
import type { CaseStudy } from './types';

export const writerAi: CaseStudy = {
  slug: 'writer-ai',
  section: 'writer-ai',
  title: 'Six named rewrite modes instead of one blunt AI button',
  summary: 'ReWrite for WRITER: highlight text, pick the job, insert the result anywhere you write.',
  company: 'WRITER',
  year: '2021',
  meta: {
    role: 'Product Designer, ReWrite',
    // TODO(seb): verify team makeup.
    team: 'Product, engineering, and the WRITER design team',
    timeline: 'Jan – Jun 2021 · shipped April 2021',
    platform: 'Web editor, Chrome and Edge, Mac and Windows, Figma',
    status: 'Shipped',
  },
  hero: {
    media: [
      {
        type: 'browser',
        video: ASSETS.video.writerRewrite,
        url: 'writer.com',
        screenAspectRatio: WRITER_REWRITE_SCREEN_AR,
        alt: 'WRITER ReWrite flow',
      },
    ],
    shape: 'wide',
    caption: 'Highlight, open the W menu, pick a mode. The writer states the intent before the model runs.',
  },
  tldr: {
    body: 'Enterprise writers needed to rephrase without losing meaning or brand voice, and one “rewrite” action was too blunt. I designed ReWrite as a selection-first flow with six named modes. It shipped across WRITER’s editor, desktop apps, browser extensions, and Figma, before open-ended chat became the default for writing tools.',
    keyResult: {
      value: '4',
      label: 'surfaces with the same ReWrite flow at launch',
      context: 'editor, desktop apps, browser extensions, Figma',
      confidence: 'measured',
    },
  },
  context: {
    heading: '“Rewrite” was one button trying to do six different jobs.',
    body: [
      'The same word covered shortening a sentence, polishing non-native phrasing, enriching thin copy, and shifting tone for a new audience.',
      'Enterprise teams also needed output that stayed on brand, so a free-form prompt was a governance risk as much as a usability one.',
    ],
    constraints: ['Brand voice and governance', 'Many host surfaces', 'Early GenAI quality'],
  },
  decisions: {
    heading: 'I made the intent explicit so the model had less to guess.',
    items: [
      {
        title: 'Name the job instead of asking for a prompt',
        body: 'Rephrase, Simplify, Polish, Shorten, Enrich, and Modify tone each map to a real writing task, so users pick an outcome rather than write instructions.',
        alternative: 'A blank prompt box where users describe the change they want.',
        tradeoff: 'Less flexibility for power users who wanted a custom instruction.',
      },
      {
        title: 'Start from the selection, stay in place',
        body: 'ReWrite opens from highlighted text and inserts the chosen alternative inline, so writers never leave the sentence they are fixing.',
        // TODO(seb): verify that a side panel was the alternative considered.
        alternative: 'A side panel that rewrites whole paragraphs.',
        tradeoff: 'Less room to compare many alternatives side by side.',
      },
      {
        title: 'One flow on every surface',
        body: 'The same highlight → W menu → mode → insert pattern ships in the editor, extensions, desktop apps, and Figma.',
        alternative: 'Native UI tuned to each host app.',
        tradeoff: 'The flow had to fit the tightest host, which limited richer controls elsewhere.',
        figure: {
          media: [
            {
              type: 'browser',
              src: '/assets/writer-page-editor.png',
              url: 'writer.com',
              screenAspectRatio: WRITER_PAGE_EDITOR_SCREEN_AR,
              alt: 'WRITER page editor',
            },
          ],
          shape: 'wide',
          caption: 'Inside the WRITER editor, ReWrite sits next to the brand and style checks teams already trusted.',
        },
      },
    ],
  },
  behavior: {
    heading: 'The writer stays in control of every insert.',
    // TODO(seb): verify these states match the shipped behavior.
    states: [
      { state: 'Select', behavior: 'Highlight text and open the W menu.' },
      { state: 'Generating', behavior: 'Shows alternatives for the chosen mode.' },
      { state: 'Review', behavior: 'Copy or insert one; nothing changes until the writer picks.' },
      { state: 'Not good enough', behavior: 'Try another mode or regenerate; the original stays intact.' },
    ],
  },
  result: {
    heading: 'Shipped on four surfaces, ahead of the chat-first wave.',
    metrics: [],
    body: [
      'ReWrite launched to Starter, Team, and Enterprise plans. It set a pattern for controlled AI edits inside WRITER, and I designed Snippets and a Figma plugin for content approvals alongside it.',
    ],
  },
  reflection: {
    heading: 'Named modes aged better than I expected.',
    body: [
      // TODO(seb): verify this reflection is yours.
      'Chat became the default, yet the modes most people use today are still verbs like shorten and simplify. Constraints made the model feel more reliable.',
    ],
  },
};
