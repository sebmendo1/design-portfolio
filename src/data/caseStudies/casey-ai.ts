import { ASSETS } from '@/data/assets';
import type { CaseStudy } from './types';

export const caseyAi: CaseStudy = {
  slug: 'casey-ai',
  section: 'chase-ai',
  title: 'Chase’s first customer-facing AI agent, live on voice and RCS',
  summary: 'One AI agent for calls and texts, launched in home lending, that hands anything it cannot answer to a licensed associate.',
  company: 'JPMorgan Chase',
  year: '2025–2026',
  meta: {
    role: 'Senior Product Designer, design lead for Casey',
    // TODO(seb): verify team makeup, especially legal and compliance as direct partners.
    team: 'AI engineers, forward deployed engineers, product, legal and compliance',
    timeline: 'Voice July 2025 · RCS May 2026',
    platform: 'Phone voice · RCS on iOS and Android',
    status: 'Shipped',
  },
  hero: {
    media: [{ type: 'phone', video: ASSETS.video.caseyRcs, alt: 'Casey RCS conversation on iPhone' }],
    caption: 'A customer who saved a mortgage application gets an RCS message from a verified Chase sender, with a link back to it.',
  },
  caseyActions: true,
  lede: [
    'Chase wanted an AI agent that could talk to customers without creating legal risk. We started in home lending, where the rules are strictest and the loans are largest.',
    'I designed Casey as one agent across voice and RCS. It qualifies customers, tells them where their application stands, and hands advice and quotes to a licensed associate.',
    'Casey Voice has handled **3,000+** production calls at about 12% lead conversion.',
  ],
  tldr: {
    situation: 'Chase wanted an AI agent that could talk to customers without creating legal risk.',
    task: 'As design lead, I had to prove it in home lending, where rules are strictest.',
    action: 'I designed Casey as one agent across voice and RCS that routes advice and quotes to a licensed associate.',
    // TODO(seb): verify timeframe for the 3,000+ calls figure.
    result: 'Casey Voice has handled 3,000+ production calls at about 12% lead conversion.',
    keyResult: {
      value: '3,000+',
      label: 'calls in production at about 12% lead conversion',
      // TODO(seb): verify timeframe for the 3,000+ calls figure.
      context: 'Casey Voice',
      confidence: 'measured',
    },
  },
  problem: {
    heading: 'Customers stalled halfway through mortgage applications and rarely came back.',
    body: [
      'Chase needed a way to reach those customers by phone and text. Any agent doing that speaks for the bank.',
      'Three rules shaped everything: first, Casey cannot give advice or quote rates; second, every call and text needs consent and a disclosure; and third, voice and text follow the same rules.',
    ],
    constraints: [
      'No advice or rate quotes',
      'Consent and disclosure on every call and text',
      'Same rules on voice and text',
    ],
  },
  whyItMatters: {
    heading: 'In home lending, one wrong answer about a rate is a compliance issue.',
    body: [
      'If Casey quoted a rate or gave advice, the bank would be on the hook.',
      'We started in home lending because it has the most regulation and the largest loans in consumer banking. An agent that works there can be reused across the bank.',
    ],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'Most of the design work defined when Casey hands a customer to a person.',
    items: [
      {
        title: 'One agent across voice and text',
        body: 'I designed Casey as one system with one set of rules: what it knows, what it may say, and when it hands off. Home lending was the first place we shipped it.',
        // TODO(seb): verify that separate voice and text agents were a real option on the table.
        alternative: 'Separate voice and text bots owned by different teams.',
        tradeoff: 'The first launch took longer, and I spent time aligning teams that would not use it for months.',
      },
      {
        title: 'Hand off early, with the conversation attached',
        body: 'Questions beyond Casey’s authority, signs of stress, and repeated confusion all go to a licensed associate. The transcript goes with the transfer, so the customer does not repeat anything.',
        // TODO(seb): verify that containment-first routing was the alternative considered.
        alternative: 'Keep as many calls as possible away from associates.',
        tradeoff: 'More conversations end with a person, which hurts a containment metric. In lending, that handoff is often where the lead converts.',
        figure: {
          media: [{ type: 'voice', alt: 'Casey Voice waveform' }],
          caption: 'Casey Voice qualifies callers, tells them where their application stands, and books time. Advice and quotes go to a licensed associate.',
        },
      },
      {
        title: 'Text customers who leave an application',
        body: 'When a customer saves an application and leaves, Casey sends an RCS message with a link back to the same step and a way to reach a person.',
        alternative: 'Email reminders or an unbranded SMS short code.',
        tradeoff: 'Outbound messages need stricter consent and careful timing. A badly timed text feels like pressure.',
        figure: {
          media: [{ type: 'phone', src: '/assets/casey-ai.png', alt: 'Casey RCS message with a recovery link' }],
          caption: 'A verified sender, one resume link, and a way to reach an associate. RCS shows the Chase brand, which plain SMS cannot.',
        },
      },
    ],
  },
  howItWorks: {
    heading: 'Casey hands off when a question is out of scope or the customer is struggling.',
    intro: 'Before each release, I ran edge-case QA against the guardrails with engineering. Every flow had to handle these states.',
    states: [
      // TODO(seb): verify Casey discloses that it is an AI assistant at the start.
      { state: 'Greeting', behavior: 'Says it is Chase’s AI assistant and what it can help with.' },
      { state: 'In scope', behavior: 'Qualifies the customer, explains their status, and books time.' },
      { state: 'Repeated confusion', behavior: 'Stops and offers a person.' },
      { state: 'Out of scope', behavior: 'Declines advice and quotes, and says who can help.' },
      { state: 'Stress detected', behavior: 'Transfers to an associate right away.' },
      { state: 'Human handoff', behavior: 'Transfers with the transcript and intent attached.' },
    ],
    figures: [
      {
        media: [
          { type: 'phone', video: ASSETS.video.caseyRcs, alt: 'Casey RCS end-to-end flow' },
          { type: 'phone', src: '/assets/casey-ai.png', alt: 'Casey RCS recovery message' },
        ],
        caption: 'Casey RCS, shipped May 2026 on iOS and Android: the notification, the resume link, and the option to reach Casey or a person.',
      },
    ],
  },
  impact: {
    heading: 'Both channels shipped, and new Chase agents reuse the handoff rules.',
    metrics: [
      { value: '3,000+', label: 'Calls initiated', context: 'Casey Voice, production', confidence: 'measured' },
      { value: '~12%', label: 'Lead conversion from those calls', context: 'Casey Voice, production', confidence: 'measured' },
      // TODO(seb): verify — from Figma draft copy ("nearly 10k messages sent"), not in repo data. Add timeframe.
      { value: '~10k', label: 'RCS messages sent', context: 'Casey RCS, since launch', confidence: 'estimated' },
    ],
    body: [
      'Chase trademarked the Casey voice. The handoff rules are now the reference for agentic work across the business, so new agents start with limits that already passed review in home lending.',
    ],
  },
  reflection: {
    heading: 'I would bring legal into prototype reviews from the first week.',
    body: [
      // TODO(seb): verify this reflection is yours.
      'Their questions changed the flows more than any usability finding did. Next, the same handoff model goes to servicing, for customers who already have a loan.',
    ],
  },
};
