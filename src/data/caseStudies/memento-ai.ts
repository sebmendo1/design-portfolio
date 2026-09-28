import { ASSETS } from '@/data/assets';
import type { CaseStudy } from './types';

export const mementoAi: CaseStudy = {
  slug: 'memento-ai',
  section: 'memento-ai',
  title: 'A private AI journal that only reflects on your own words',
  summary: 'A native iOS journal whose AI answers only from your entries, and shows which ones.',
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
    caption: 'Write, get one question back, keep writing. The AI never says anything your journal did not.',
  },
  tldr: {
    body: 'AI journaling apps answer with generic, confident text that can overwrite the writer’s voice. I designed and built Memento, a native iOS journal where a local retrieval pipeline limits every reflection to your own past entries and cites them. Early testers wrote more often when they could see where each insight came from.',
    keyResult: {
      value: 'Beta',
      label: 'closed beta underway ahead of public launch',
      // TODO(seb): add tester count and what "wrote more often" was measured against.
      confidence: 'directional',
    },
  },
  context: {
    heading: 'A journal only works if it feels completely safe.',
    body: [
      'Generic models synthesize impersonal advice, and uncited insights leave people feeling watched rather than understood. Either one ends the habit.',
      'I owned the whole stack, so every product promise had to be something I could also build on a phone.',
    ],
    constraints: ['Private by default', 'Answers grounded only in the user’s entries', 'One person building it'],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'Three constraints made the AI quieter and more trustworthy.',
    items: [
      {
        title: 'The AI can only speak from your own entries',
        body: 'I built retrieval over the user’s journal and limited responses to what it returns, so reflections sound like the writer, not a chatbot.',
        alternative: 'A general model that answers anything, with the journal as extra context.',
        tradeoff: 'Memento has less to say early on, when a new user has few entries.',
      },
      {
        title: 'Show the receipts in a Dive Deeper panel',
        body: 'Every reflection links to the exact entries it drew on, so the user can check the insight against what they actually wrote.',
        alternative: 'A polished summary with no visible sources.',
        tradeoff: 'More interface on a screen I wanted to keep nearly empty.',
        figure: {
          media: [
            { type: 'phone', src: '/assets/memento-journal-feed.png', alt: 'Memento journal feed' },
            { type: 'phone', src: '/assets/memento-insights.png', alt: 'Memento insights with cited entries' },
          ],
          caption: 'The feed stays plain. Insights cite the entries behind them, so trust comes from evidence, not tone.',
        },
      },
      {
        title: 'No streaks, no push notifications',
        body: 'After each entry the AI asks one follow-up question, and tapping it opens a blank page. Writing leads to more writing.',
        alternative: 'Streaks and daily reminders, the default engagement loop for journaling apps.',
        tradeoff: 'I gave up the easiest retention levers and have to earn return visits.',
      },
    ],
  },
  behavior: {
    heading: 'When there is nothing to cite, Memento says so.',
    states: [
      { state: 'Writing', behavior: 'No AI on screen until the entry is saved.' },
      { state: 'Reflecting', behavior: 'Retrieves related entries, then asks one question.' },
      { state: 'Grounded answer', behavior: 'Shows the reflection with its cited entries.' },
      // TODO(seb): verify how Memento handles too little history to cite.
      { state: 'Not enough history', behavior: 'Asks an open question instead of inventing an insight.' },
    ],
  },
  shipped: {
    heading: 'A calm editorial loop, from first entry to reflection.',
    figures: [
      {
        media: [{ type: 'phone', src: '/assets/memento-ai.png', alt: 'Memento entry screen' }],
        caption: 'The feed reads like a notebook: dated entries and photos, with no streaks, scores, or reminders competing for attention.',
      },
    ],
  },
  result: {
    heading: 'Privacy turned out to be the feature people noticed first.',
    metrics: [],
    body: [
      // TODO(seb): verify the testing claim and add numbers you can defend (testers, entries per week, baseline).
      'In early testing, people wrote more often and at greater length once they trusted that nothing left the phone. Memento is in closed beta ahead of public launch.',
    ],
  },
  reflection: {
    heading: 'Next, I want the first week to feel as good as the tenth.',
    body: [
      'Grounding is great with history and thin without it. I am designing a gentler first week that earns enough entries for reflections to matter.',
    ],
  },
};
