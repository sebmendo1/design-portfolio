import type { CaseStudy } from './types';

export const agenticHomeLending: CaseStudy = {
  slug: 'agentic-home-lending',
  section: 'chase-ai',
  title: 'An agent that tells mortgage applicants what is next, and why',
  summary: 'Agentic flows for Chase home lending that ask for the right document at the right time.',
  company: 'JPMorgan Chase',
  // TODO(seb): verify year; projects.ts says 2024, the homepage says 2026.
  year: '2026',
  meta: {
    role: 'Senior Product Designer, Chase AI',
    // TODO(seb): verify team makeup.
    team: 'AI engineers, product, home lending operations, and compliance',
    // TODO(seb): verify timeline.
    timeline: 'Pilot, 2026',
    platform: 'Chase mobile app',
    status: 'Pilot',
  },
  hero: {
    media: [{ type: 'phone', src: '/assets/agentic-home-lending.png', alt: 'Agentic home lending flow on iPhone' }],
    // TODO(seb): verify this screen is the pilot's entry point.
    caption: 'The front door is a conversation, not a form. Applicants ask about home loans before the agent asks them for anything.',
  },
  tldr: {
    situation: 'Mortgages meant weeks of document back-and-forth, and applicants rarely knew where they stood.',
    task: 'My job was to shift that burden from applicant to system.',
    action: 'I designed agentic flows that request each document when needed, flag issues before underwriting, and show progress as a confidence score.',
    // TODO(seb): verify the task framing and pilot scope.
    result: 'The pilot is live with a limited group of applicants.',
    keyResult: {
      value: 'Pilot',
      label: 'live with a limited group of applicants',
      // TODO(seb): verify pilot status and scope.
      confidence: 'directional',
    },
  },
  context: {
    heading: 'Applicants could not tell whether they were close or at risk.',
    body: [
      // TODO(seb): verify the 45-day figure and its source.
      'Origination could take about 45 days of document exchanges, and every re-request felt like a setback.',
      'Like Casey, the agent could guide but never advise or promise approval.',
    ],
    constraints: ['No advice or approval promises', 'Underwriting stays with people', 'Every document request explained'],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'I shifted the work from the applicant to the system.',
    items: [
      {
        title: 'Ask for one document at the right moment',
        body: 'The agent requests each document when the file needs it and says why, instead of front-loading every requirement.',
        alternative: 'An upfront checklist of everything the lender might need.',
        tradeoff: 'More touchpoints over the life of the application.',
      },
      {
        title: 'Show certainty, not just steps',
        body: 'A Progress Certainty Score shows how close the file is to underwriting-ready, and what would raise it.',
        alternative: 'A classic step-based progress bar.',
        tradeoff: 'The score has to be calibrated, or it creates false confidence in a high-stakes decision.',
      },
      {
        title: 'Flag problems before underwriting does',
        body: 'The agent checks documents as they arrive and flags gaps early, then suggests alternatives when the first loan option does not fit, routed through a loan officer.',
        alternative: 'Let underwriting catch issues and send the file back.',
        tradeoff: 'Early flags can worry applicants about issues that would have resolved on their own.',
      },
    ],
  },
  behavior: {
    heading: 'The agent is clear about what it cannot decide.',
    // TODO(seb): verify these states match the shipped pilot.
    states: [
      { state: 'Requesting', behavior: 'Asks for one document and explains why.' },
      { state: 'Checking', behavior: 'Reviews the upload and confirms or flags a gap.' },
      { state: 'Low confidence', behavior: 'Lowers the certainty score and says what would raise it.' },
      { state: 'Can’t decide', behavior: 'States that approval belongs to underwriting.' },
      { state: 'Human handoff', behavior: 'Routes loan options and exceptions to a loan officer.' },
    ],
  },
  result: {
    heading: 'Early pilot signals point to faster closes.',
    metrics: [
      // TODO(seb): verify all three pilot numbers, their baselines, and whether they are cleared to publish.
      { value: '−41%', label: 'Time to close', context: 'internal pilot', confidence: 'directional' },
      { value: '−28%', label: 'Document re-requests', context: 'internal pilot', confidence: 'directional' },
      { value: '22 → 61', label: 'NPS', context: 'internal pilot', confidence: 'directional' },
    ],
    body: ['These numbers reflect pilot scope, not a full production rollout.'],
  },
  reflection: {
    heading: 'Next: the same agent after the loan closes.',
    body: [
      'Servicing is where customers live for decades. The next step is carrying the document and handoff patterns into loan servicing.',
    ],
  },
};
