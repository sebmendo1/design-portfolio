import { ASSETS } from '@/data/assets';
import type { CaseStudy } from './types';

export const caseyAi: CaseStudy = {
  slug: 'casey-ai',
  section: 'chase-ai',
  title: 'Chase’s first customer-facing AI agent, live on voice and RCS',
  summary: 'One agent for voice and text, proven in home lending, built around the handoff to a human.',
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
    caption: 'A saved mortgage application comes back to life over RCS, from a verified Chase sender.',
  },
  caseyActions: true,
  tldr: {
    body: 'Chase needed an AI agent that could talk to customers without creating legal exposure. I led design for Casey, one agent across voice and RCS, and proved it in home lending, the most regulated journey in the bank. Most of the work went into the handoff to a licensed human.',
    keyResult: {
      value: '3,000+',
      label: 'calls in production at about 12% lead conversion',
      // TODO(seb): verify timeframe for the 3,000+ calls figure.
      context: 'Casey Voice',
      confidence: 'measured',
    },
  },
  context: {
    heading: 'Every sentence the agent says is a sentence the bank said.',
    body: [
      'Voice and text are the two channels federal law watches most closely. One confident but wrong answer about a rate is a compliance event, not a UX bug.',
      'Home lending raised the stakes: the most regulation, the largest dollar amounts, and a journey where customers stall mid-application and rarely come back on their own.',
    ],
    constraints: [
      'Casey may not advise or quote',
      'Consent and disclosure on every call and text',
      'Same limits on voice and text',
    ],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'The design work was deciding what Casey should refuse to do.',
    items: [
      {
        title: 'One agent with two surfaces, not a mortgage bot',
        body: 'I framed Casey as a single system with one model of what it knows, what it may say, and when it steps aside, then proved it where the rules are strictest.',
        // TODO(seb): verify that separate voice and text agents were a real option on the table.
        alternative: 'Separate voice and text bots owned by different teams.',
        tradeoff: 'A slower first launch and more alignment with teams that would not ship on it for months.',
      },
      {
        title: 'The handoff is the product',
        body: 'Anything beyond Casey’s authority, any sign of stress, and any repeated confusion routes to a person with the whole conversation attached. Customers never repeat themselves.',
        // TODO(seb): verify that containment-first routing was the alternative considered.
        alternative: 'Maximizing containment and keeping calls away from associates.',
        tradeoff: 'More conversations end with a human, which a pure automation metric would punish. In lending, the warm handoff is the conversion.',
        figure: {
          media: [{ type: 'voice', alt: 'Casey Voice waveform' }],
          caption: 'Casey Voice qualifies, explains, and schedules. Advice and quotes go to a licensed associate, with context attached.',
        },
      },
      {
        title: 'Reach out when the customer stalls',
        body: 'Instead of waiting for inbound calls, Casey texts customers who save and leave an application, with a link back to where they stopped and a person one tap away.',
        alternative: 'Email reminders or an unbranded SMS short code.',
        tradeoff: 'Proactive messages raise the bar on consent and tone. A badly timed text reads as pressure.',
        figure: {
          media: [{ type: 'phone', src: '/assets/casey-ai.png', alt: 'Casey RCS message with a recovery link' }],
          caption: 'Verified sender, one clear action, and an associate one tap away. RCS made the message trustworthy enough to act on.',
        },
      },
    ],
  },
  behavior: {
    heading: 'Casey knows when to stop talking.',
    intro: 'I ran edge-case QA against the guardrails with engineering before each release. These are the states every flow had to handle.',
    states: [
      // TODO(seb): verify Casey discloses that it is an AI assistant at the start.
      { state: 'Greeting', behavior: 'Says it is Chase’s AI assistant and what it can help with.' },
      { state: 'In scope', behavior: 'Qualifies, explains where the customer is, and schedules time.' },
      { state: 'Repeated confusion', behavior: 'Stops trying and offers a person.' },
      { state: 'Can’t or won’t', behavior: 'Declines advice and quotes, and says who can help.' },
      { state: 'Stress detected', behavior: 'Moves straight to an associate.' },
      { state: 'Human handoff', behavior: 'Transfers with the transcript and intent attached.' },
    ],
  },
  shipped: {
    heading: 'From the nudge to a live associate without repeating a word.',
    figures: [
      {
        media: [
          { type: 'phone', video: ASSETS.video.caseyRcs, alt: 'Casey RCS end-to-end flow' },
          { type: 'phone', src: '/assets/casey-ai.png', alt: 'Casey RCS recovery message' },
        ],
        caption: 'Casey RCS, shipped May 2026 on iOS and Android: notification, resume link, and a path to Casey or a person.',
      },
    ],
  },
  result: {
    heading: 'Two surfaces shipped, and the pattern the next agents start from.',
    metrics: [
      { value: '3,000+', label: 'Calls initiated', context: 'Casey Voice, production', confidence: 'measured' },
      { value: '~12%', label: 'Lead conversion from those calls', context: 'Casey Voice, production', confidence: 'measured' },
      // TODO(seb): verify — from Figma draft copy ("nearly 10k messages sent"), not in repo data. Add timeframe.
      { value: '~10k', label: 'RCS messages sent', context: 'Casey RCS, since launch', confidence: 'estimated' },
    ],
    body: [
      'Chase trademarked the Casey voice. The handoff rules became the reference model for agentic work across the business, so new agents start from limits that already cleared home lending.',
    ],
  },
  reflection: {
    heading: 'I would put legal in the prototype reviews from week one.',
    body: [
      // TODO(seb): verify this reflection is yours.
      'Their questions changed the flows more than any usability finding. Next, the same handoff model moves to servicing, where customers already have a loan.',
    ],
  },
};
