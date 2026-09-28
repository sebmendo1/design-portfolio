import { ASSETS } from '@/data/assets';
import type { CaseStudy } from './types';

export const mementoAi: CaseStudy = {
  slug: 'memento-ai',
  section: 'memento-ai',
  title: 'A private iOS journal whose AI cites only your own entries',
  summary: 'A native iOS journal. Its AI reflections draw only on your past entries and link back to them.',
  company: 'Memento AI · Personal project',
  // TODO(seb): verify year; projects.ts says 2023, the homepage and shipped log say 2026.
  year: '2026',
  meta: {
    role: 'Designer and engineer, end to end',
    team: 'Solo: product, design, iOS, and the retrieval pipeline',
    // TODO(seb): verify timeline and beta status.
    timeline: 'Closed beta, 2026',
    platform: 'Native iOS',
    status: 'In beta',
  },
  hero: {
    media: [{ type: 'phone', video: ASSETS.video.mementoDemo, alt: 'Memento journaling and reflection flow' }],
    caption: 'Write an entry, answer one follow-up question, keep writing. Every reflection draws on entries you wrote.',
  },
  tldr: {
    situation: 'AI journaling apps answer with generic advice that can drown out the writer’s own voice.',
    task: 'I wanted reflections built only from what the writer had written.',
    action: 'I designed and built Memento, a native iOS journal whose local retrieval pipeline cites past entries in every reflection.',
    // TODO(seb): verify the tester result; the key result below has the same open question.
    result: 'Early testers wrote more often once they could see where each reflection came from.',
    keyResult: {
      value: 'Beta',
      label: 'closed beta underway ahead of public launch',
      // TODO(seb): add tester count and what "wrote more often" was measured against.
      confidence: 'directional',
    },
  },
  context: {
    heading: 'People stop journaling when the AI feels like it is watching them.',
    body: [
      'Generic model responses flatten the writer’s voice, and insights with no sources feel intrusive. In a journal, either one is enough to make people stop writing.',
      'I was also the only engineer, so every design decision had to be something I could build and run on the phone.',
    ],
    constraints: ['Private by default', 'Answers only from the user’s entries', 'Solo designer and engineer'],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'I limited what the AI could say, and showed where each line came from.',
    items: [
      {
        title: 'Retrieval runs only over the user’s journal',
        body: 'Memento finds related entries first, and the model answers only from those. Reflections reuse the writer’s own phrasing instead of generic advice.',
        alternative: 'A general model that answers anything, with the journal passed in as extra context.',
        tradeoff: 'With only a few entries, Memento has little to reflect on.',
      },
      {
        title: 'A Dive Deeper panel lists the source entries',
        body: 'Each reflection links to the exact entries it used, so the writer can check it against what they wrote.',
        alternative: 'A summary with no visible sources.',
        tradeoff: 'An extra panel on a screen I wanted to keep almost empty.',
        figure: {
          media: [
            { type: 'phone', src: '/assets/memento-journal-feed.png', alt: 'Memento journal feed' },
            { type: 'phone', src: '/assets/memento-insights.png', alt: 'Memento insights with cited entries' },
          ],
          caption: 'Left: the entry feed, with no scores or streaks. Right: Dive Deeper, where reflections link back to the entries they used.',
        },
      },
      {
        title: 'No streaks and no push notifications',
        body: 'After each entry, the AI asks one follow-up question. Tapping it opens a blank page for the next entry.',
        alternative: 'Streaks and daily reminders, the standard retention tools for journaling apps.',
        tradeoff: 'Without them, people come back only if writing feels worth it.',
      },
    ],
  },
  behavior: {
    heading: 'With too little history, Memento asks instead of guessing.',
    states: [
      { state: 'Writing', behavior: 'No AI on screen until the entry is saved.' },
      { state: 'Reflecting', behavior: 'Finds related entries, then asks one question.' },
      { state: 'Grounded answer', behavior: 'Shows the reflection with links to its source entries.' },
      // TODO(seb): verify how Memento handles too little history to cite.
      { state: 'Not enough history', behavior: 'Asks an open question instead of making up an insight.' },
    ],
  },
  shipped: {
    heading: 'The shipped loop: write, answer one question, write again.',
    figures: [
      {
        media: [{ type: 'phone', src: '/assets/memento-ai.png', alt: 'Memento entry screen' }],
        caption: 'The feed shows dated entries and photos. There are no streaks, scores, or reminders.',
      },
    ],
  },
  result: {
    heading: 'Testers wrote more once they trusted that entries stayed on the phone.',
    metrics: [],
    body: [
      // TODO(seb): verify the testing claim and add numbers you can defend (testers, entries per week, baseline).
      'In early testing, people wrote more often and at greater length once they understood their entries stayed on the device. Memento is in closed beta ahead of public launch.',
    ],
  },
  reflection: {
    heading: 'Next: make the first week useful with only a few entries.',
    body: [
      'Reflections improve as history grows, so the first week is the weakest. I am designing prompts that help new writers build up enough entries for reflections to be useful.',
    ],
  },
};
