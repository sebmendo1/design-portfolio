import { ASSETS } from '@/data/assets';
import type { CaseStudy } from './types';

export const caseyAi: CaseStudy = {
  slug: 'casey-ai',
  section: 'chase-ai',
  title: 'Casey, Chase’s first customer-facing AI agent',
  summary:
    'One conversational system for voice and RCS, proven in home lending, the most regulated room in the bank.',
  company: 'JPMorgan Chase',
  year: '2025–2026',
  meta: {
    role: 'Design lead, Casey Voice and Casey RCS',
    // TODO(seb): verify team composition wording.
    team: 'AI engineers, forward deployed engineers, product, legal, compliance, and home lending operations',
    timeline: 'Voice shipped July 2025 · RCS shipped May 2026',
    platform: 'Phone voice agent · RCS on iOS and Android',
    impact: '3,000+ calls in production at about 12% lead conversion',
  },
  hero: {
    media: [{ type: 'phone', video: ASSETS.video.caseyRcs, alt: 'Casey RCS conversation on iPhone' }],
    caption: 'Casey RCS recovering a saved mortgage application over rich messaging.',
  },
  caseyActions: true,
  tldr: {
    heading: 'A bank cannot ship a chatbot. It can ship an agent that knows its limits.',
    body: 'Chase needed a customer-facing AI agent that would not create legal exposure every time it spoke. I designed Casey as a reusable conversational system across voice and text, proved it in home lending because that is the hardest environment in the bank, and spent most of the project on the boundary where the agent hands a customer to a licensed human.',
    outcomes: [
      { value: '2', label: 'Surfaces shipped: voice in 2025, RCS in 2026' },
      { value: '3,000+', label: 'Production calls at about 12% lead conversion' },
      { value: '1', label: 'Pattern now reused for agentic work across Chase' },
    ],
  },
  problem: {
    heading: 'Every sentence the agent says is a sentence the bank said.',
    body: [
      'Voice and text are the two channels federal law watches most closely. A generic assistant that talks well is a liability here: one confident but wrong answer about a rate or an approval becomes a compliance event, not a UX bug.',
      'Home lending made it harder. Mortgages carry the most regulation, the largest dollar amounts, and the longest customer journey in consumer banking. Customers stall mid-application, leave, and rarely come back on their own.',
      'The real problem was not building an agent that sounds natural. It was building one that knows exactly what it is not allowed to say, and makes that limit feel like help instead of a wall.',
    ],
    quote: 'Anything that survives home lending works anywhere in the bank.',
  },
  constraints: {
    heading: 'The boundaries were set before the first flow was drawn.',
    items: [
      {
        title: 'No advice, no quotes',
        body: 'Casey can qualify, explain, and schedule. Advising or quoting requires a licensed loan officer, so every flow had to route around it.',
      },
      {
        title: 'Regulated channels',
        body: 'Calls and text messages carry consent, disclosure, and recording obligations that shape the first seconds of every conversation.',
      },
      {
        title: 'Two surfaces, one brain',
        body: 'Voice has no screen and RCS has no voice. The same knowledge and the same limits had to hold on both without two separate products.',
      },
      {
        // TODO(seb): verify that legal/compliance sign-off was required per flow.
        title: 'Legal sign-off on every path',
        body: 'Each conversational branch needed review from legal and compliance, so the design had to be legible to people who do not read Figma.',
      },
    ],
  },
  decisions: {
    heading: 'Four calls that shaped Casey.',
    intro: 'Most of the design work was deciding what the agent should refuse to do, and how.',
    items: [
      {
        title: 'Design a system, not a mortgage feature',
        body: 'I framed Casey as one agent with two surfaces and a shared model of what it knows, what it may say, and when it steps aside, then proved that model in home lending first.',
        tradeoff: 'Slower first launch than a one-off home lending bot, and more alignment work with teams who would not ship on it for months.',
        rationale: 'Starting where the stakes are highest meant the guardrails would already be strict enough for every line of business that followed.',
      },
      {
        title: 'Make the handoff the product',
        body: 'Any question beyond Casey’s authority, any sign of customer stress, and any repeated confusion routes to a person with the full conversation attached, so the customer never repeats themselves.',
        tradeoff: 'More conversations end with a human, which lowers the containment rate a pure automation metric would reward.',
        rationale: 'In lending, a warm handoff to a licensed associate is the conversion. Containment that frustrates a borrower loses the loan.',
      },
      {
        title: 'Reach out when the customer stalls',
        body: 'Instead of waiting for inbound calls, Casey texts customers who save and leave an application, with a magic link that drops them back where they left off.',
        tradeoff: 'Proactive messages raise the bar for consent and tone. A badly timed text feels like pressure.',
        rationale: 'Abandoned applications were the clearest recoverable value in the journey, and RCS gives a verified, branded sender instead of an anonymous short code.',
        figure: {
          media: [
            { type: 'phone', src: '/assets/casey-ai.png', alt: 'Casey RCS message with a recovery link' },
          ],
          caption: 'The recovery message: verified Chase sender, one clear action, a human one tap away.',
        },
      },
      {
        // TODO(seb): verify Casey discloses it is an AI and states its scope at the start of a call.
        title: 'Give the voice a name and a limit',
        body: 'Casey introduces itself as an AI assistant up front and says what it can help with, so customers calibrate their expectations before the first question.',
        tradeoff: 'A named persona invites customers to ask for more than it can do.',
        rationale: 'Disclosure plus a clear scope set expectations early, and the handoff catches everything outside it. Chase went on to trademark the voice.',
        figure: {
          media: [{ type: 'voice', alt: 'Casey Voice waveform' }],
          caption: 'Casey Voice has answered home lending calls since July 2025.',
        },
      },
    ],
  },
  explorations: {
    heading: 'What we tried before landing on the pattern.',
    // TODO(seb): verify these explorations reflect real directions the team considered.
    items: [
      {
        title: 'Separate voice and text agents',
        body: 'Two teams, two scripts, two sets of guardrails. Fast to start, but the limits drifted apart and legal would have reviewed everything twice.',
        verdict: 'dropped',
      },
      {
        title: 'Deflection-first IVR replacement',
        body: 'Optimizing for calls kept away from associates. It tested as efficient and felt like a maze to borrowers mid-application.',
        verdict: 'dropped',
      },
      {
        title: 'Rich product carousels in RCS',
        body: 'Loan products as swipeable cards. Visually strong, but it edged toward a quote. We kept rich cards for actions like resuming or scheduling instead.',
        verdict: 'evolved',
      },
      {
        title: 'Conversation-attached handoff',
        body: 'Routing to an associate with the transcript and intent attached. This became the core of every Casey flow.',
        verdict: 'shipped',
      },
    ],
  },
  finalDesign: {
    heading: 'One agent, two surfaces, one set of limits.',
    body: [
      'On the phone, Casey answers home lending calls, explains where the customer is in the process, schedules time with an associate, and hands off with context when it reaches the edge of what it may say.',
      'Over RCS, Casey recovers stalled applications: a customer saves and leaves, and later gets a verified Chase message with a link straight back into their application, plus the option to talk to Casey or a live associate.',
    ],
    figures: [
      {
        media: [
          { type: 'phone', video: ASSETS.video.caseyRcs, alt: 'Casey RCS end-to-end flow' },
          { type: 'phone', src: '/assets/casey-ai.png', alt: 'Casey RCS recovery message' },
        ],
        caption: 'Casey RCS: from the recovery nudge to a live associate without repeating a word.',
      },
    ],
  },
  results: {
    heading: 'Live on two surfaces, and the model the next agents are built on.',
    metrics: [
      { value: '3,000+', label: 'Calls initiated in production', note: 'Casey Voice' },
      { value: '~12%', label: 'Lead conversion from those calls', note: 'Casey Voice' },
      // TODO(seb): verify — from Figma draft copy ("nearly 10k messages sent"), not in repo data.
      { value: '~10k', label: 'RCS messages sent since launch', note: 'Casey RCS' },
    ],
    body: [
      'Casey Voice shipped in July 2025 and Casey RCS shipped in May 2026 on iOS and Android. Chase trademarked the voice.',
      'The conversational patterns, especially the handoff routing, became the reference model for agentic work across the business, so the next Chase agents start from rules that already cleared home lending.',
    ],
  },
  reflection: {
    heading: 'The most valuable design artifact was the list of things Casey will not do.',
    body: [
      'In a regulated product the limits are the experience. Treating the refusal and the handoff as first-class flows, with the same craft as the happy path, is what let Casey ship at all.',
      // TODO(seb): verify this reflection is how you would describe it.
      'If I did it again I would bring legal and compliance into the prototype reviews even earlier. Their questions were design input, not a gate at the end.',
    ],
    // TODO(seb): verify these next steps match the roadmap you can share publicly.
    next: [
      'Extend the handoff model to servicing, where customers already have a loan.',
      'Measure handoff quality, not just containment, as the primary agent metric.',
      'Carry the same limits into internal agent tools used by associates.',
    ],
  },
};
