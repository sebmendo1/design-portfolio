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
  summary: 'ReWrite for WRITER: highlight text, pick the kind of edit, and insert the result where you are writing.',
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
    caption: 'Highlight text, open the W menu, and pick a mode. The writer chooses the kind of edit before the model runs.',
  },
  lede: [
    'Enterprise writers needed to rephrase without losing meaning or brand voice, and a single “rewrite” action was too blunt.',
    'I designed ReWrite as a flow that starts from selected text and offers six named modes.',
    'It shipped in April 2021 across **4** surfaces: the editor, desktop apps, browser extensions, and Figma.',
  ],
  tldr: {
    situation: 'Enterprise writers needed to rephrase without losing meaning or brand voice, and a single “rewrite” action was too blunt.',
    task: 'I was the product designer on ReWrite, WRITER’s rewriting feature.',
    action: 'I designed it as a flow that starts from selected text and offers six named modes.',
    result: 'It shipped in April 2021 across the editor, desktop apps, browser extensions, and Figma.',
    keyResult: {
      value: '4',
      label: 'surfaces with the same ReWrite flow at launch',
      context: 'editor, desktop apps, browser extensions, Figma',
      confidence: 'measured',
    },
  },
  problem: {
    heading: '“Rewrite” was one button trying to do six different jobs.',
    body: [
      'The same word covered shortening a sentence, fixing non-native phrasing, adding detail to thin copy, and changing tone for a new audience.',
      'Three constraints shaped ReWrite: first, brand voice and governance; second, many host apps; and third, early generative AI quality.',
    ],
    constraints: ['Brand voice and governance', 'Many host apps', 'Early generative AI quality'],
  },
  whyItMatters: {
    heading: 'Enterprise teams needed AI edits that stayed on brand.',
    body: [
      'Writers had to rephrase without losing meaning, tone, or brand voice. An open prompt box made that harder to control, so it was a governance risk as well as a usability problem.',
    ],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'Writers pick the kind of edit, so the model has less to guess.',
    items: [
      {
        title: 'Named modes instead of a prompt box',
        body: 'Rephrase, Simplify, Polish, Shorten, Enrich, and Modify tone each match a real writing task. Users pick the result they want instead of writing instructions.',
        alternative: 'A blank prompt box where users describe the change they want.',
        tradeoff: 'Less flexibility for power users who wanted a custom instruction.',
      },
      {
        title: 'Start from the selection and insert in place',
        body: 'ReWrite opens from highlighted text and inserts the chosen version in the same spot, so writers stay in the sentence they are editing.',
        // TODO(seb): verify that a side panel was the alternative considered.
        alternative: 'A side panel that rewrites whole paragraphs.',
        tradeoff: 'Less room to compare several versions side by side.',
      },
      {
        title: 'The same flow in every app',
        body: 'Highlight, open the W menu, pick a mode, insert. The same four steps ship in the editor, browser extensions, desktop apps, and Figma.',
        alternative: 'Native UI tuned to each host app.',
        tradeoff: 'The flow had to fit the most cramped host, which ruled out richer controls in the others.',
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
          caption: 'In the WRITER editor, ReWrite sits next to the brand and style checks teams already used.',
        },
      },
    ],
  },
  howItWorks: {
    heading: 'Nothing changes until the writer inserts a version.',
    // TODO(seb): verify these states match the shipped behavior.
    states: [
      { state: 'Select', behavior: 'Highlight text and open the W menu.' },
      { state: 'Generating', behavior: 'Shows versions for the chosen mode.' },
      { state: 'Review', behavior: 'Copy or insert one. The text stays as it was until the writer picks.' },
      { state: 'Not good enough', behavior: 'Try another mode or regenerate. The original stays intact.' },
    ],
  },
  impact: {
    heading: 'Shipped in four places in April 2021.',
    metrics: [],
    body: [
      'ReWrite launched on the Starter, Team, and Enterprise plans. At WRITER I also designed Snippets, for storing and reusing content, and a Figma plugin for content approvals.',
    ],
  },
  reflection: {
    heading: 'Named modes held up better than I expected.',
    body: [
      // TODO(seb): verify this reflection is yours.
      'Chat later became the default for writing tools. I still think named modes suit quick edits better, because the writer states the intent up front.',
    ],
  },
};
