import type { CaseStudy } from './types';

export const agenticHomeLending: CaseStudy = {
  slug: 'agentic-home-lending',
  section: 'chase-ai',
  title: 'An agent that tells mortgage applicants what is next, and why',
  summary: 'Agentic flows for Chase home lending that request each document when the file needs it.',
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
    caption: 'Applicants start by asking questions in a chat. The agent asks for documents later, once the application needs them.',
  },
  tldr: {
    situation: 'Getting a mortgage meant weeks of document requests, and applicants rarely knew where they stood.',
    task: 'My job was to move that tracking work from the applicant to the system.',
    action: 'I designed agentic flows that request each document when needed, flag issues before underwriting, and show progress as a certainty score.',
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
    heading: 'Applicants could not tell whether they were close to approval or at risk.',
    body: [
      // TODO(seb): verify the 45-day figure and its source.
      'Origination could take about 45 days of document exchanges, and each re-request felt like going backwards.',
      'As with Casey, the agent could guide applicants but could not give advice or promise approval.',
    ],
    constraints: ['No advice or approval promises', 'Underwriting decisions stay with people', 'Every document request explained'],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'The agent took on the tracking that applicants used to do themselves.',
    items: [
      {
        title: 'Request each document when the file needs it',
        body: 'The agent asks for one document at a time, at the point the file needs it, and says what it is for.',
        alternative: 'An upfront checklist of everything the lender might need.',
        tradeoff: 'Applicants hear from the agent more often over the life of the loan.',
      },
      {
        title: 'A Progress Certainty Score instead of a step count',
        body: 'The score shows how close the file is to being ready for underwriting, and what would raise it.',
        alternative: 'A standard step-by-step progress bar.',
        tradeoff: 'The score has to be calibrated. If it is off, it gives applicants false confidence about a large financial decision.',
      },
      {
        title: 'Flag document problems before underwriting',
        body: 'The agent checks each upload as it arrives and flags gaps right away. When the first loan option does not fit, it suggests alternatives through a loan officer.',
        alternative: 'Let underwriting catch issues and send the file back.',
        tradeoff: 'Early flags can worry applicants about problems that would have resolved on their own.',
      },
    ],
  },
  behavior: {
    heading: 'The agent says plainly that approval is not its call.',
    // TODO(seb): verify these states match the shipped pilot.
    states: [
      { state: 'Requesting', behavior: 'Asks for one document and explains why.' },
      { state: 'Checking', behavior: 'Reviews the upload, then confirms it or flags a gap.' },
      { state: 'Low confidence', behavior: 'Lowers the certainty score and says what would raise it.' },
      { state: 'Can’t decide', behavior: 'Says that approval is up to underwriting.' },
      { state: 'Human handoff', behavior: 'Routes loan options and exceptions to a loan officer.' },
    ],
  },
  result: {
    heading: 'Early pilot numbers point to faster closes, at limited scope.',
    metrics: [
      // TODO(seb): verify all three pilot numbers, their baselines, and whether they are cleared to publish.
      { value: '−41%', label: 'Time to close', context: 'internal pilot', confidence: 'directional' },
      { value: '−28%', label: 'Document re-requests', context: 'internal pilot', confidence: 'directional' },
      { value: '22 → 61', label: 'NPS', context: 'internal pilot', confidence: 'directional' },
    ],
    body: ['These numbers come from a limited pilot, not a full production rollout.'],
  },
  reflection: {
    heading: 'Next: the same agent after the loan closes.',
    body: [
      'Customers stay in loan servicing for years. The next step is bringing the document and handoff patterns there.',
    ],
  },
};
