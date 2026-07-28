/** Confidence level for quantified claims published on the site. */
export type ClaimConfidence = 'verified' | 'measured' | 'pilot' | 'qualitative';

export type VerifiedImpact = {
  id: string;
  metric: string;
  value: string;
  context: string;
  confidence: ClaimConfidence;
  /** Optional link to supporting case study slug */
  projectSlug?: string;
};

export type ProfileRole = {
  id: string;
  company: string;
  role: string;
  /** Human-readable period, e.g. "Jul 2025 – Present" */
  period: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  employmentType?: string;
  summary: string;
  responsibilities: string[];
  outcomes: string[];
  capabilities: string[];
  relatedProjectSlugs?: string[];
};

export const PROFILE_LAST_UPDATED = '2026-07-12';

export const PROFILE = {
  name: 'Sebastian Mendo',
  publicTitle: 'Senior Product Designer',
  headline:
    'Senior Product Designer leading 0-to-1 AI products in regulated and enterprise systems.',
  /** Warm copy for the About page — first person, not resume-speak. */
  aboutIntro: {
    title: 'Hey, I\'m Seb.',
    paragraphs: [
      'I\'m a Senior Product Designer at Chase working on Consumer AI. I\'ve designed and shipped voice agents, RCS bots, and conversational flows within the regulated environment of consumer banking, partnering with flagship frontier AI labs.',
      'Previously, I worked with some incredible people at Salesforce, Writer AI, and Chorus AI, where we designed AI experiences since before the launch of ChatGPT.',
      'Outside of work, I like to design my own iOS apps, and participate in tech meetups and run clubs',
    ],
  },
  executiveSummary:
    'Sebastian Mendo is a Senior Product Designer at JPMorgan Chase, where he leads design for Casey AI—Chase\'s first consumer-facing AI agent for home lending—and previously shaped Chase MyHome onboarding and mortgage flows. Before banking, he designed AI-powered enterprise support at Salesforce and early GenAI content tools at WRITER. He combines product strategy, conversational AI UX, regulated design, and hands-on AI-native development.',
  positioningStatement:
    'Senior Product Designer specialized in agentic AI, voice and conversational UX, and shipping customer-centric products inside highly regulated environments.',
  domains: [
    'Agentic AI',
    'Conversational UX',
    'Voice AI',
    'Regulated fintech',
    'Enterprise SaaS',
    'Design systems',
    'AI-native product development',
  ],
  capabilities: [
    '0-to-1 product design',
    'Cross-functional leadership with AI engineers and FDEs',
    'Conversational flow design for complex banking use cases',
    'Agentic guardrail QA and edge-case prioritization',
    'WCAG accessibility documentation',
    'Design system contribution',
    'Mentoring and design leadership',
    'AI-native prototyping with Cursor, Claude Code, VSCode, and Figma MCP',
  ],
  tools: ['Figma', 'Cursor', 'Claude Code', 'VSCode', 'Figma MCP'],
  staffLevelEvidence: [
    'Led design and launch of Casey AI, Chase\'s first consumer-facing AI agent',
    'Drove strategic redesign of Chase MyHome onboarding with measurable account-creation lift',
    'Shipped AI Contact Support at Salesforce with doubled CSAT and reduced case volume',
    'Mentors junior designers on AI-native programming and technical fluency',
    'Conducts design thinking sessions for strategic AI implementation at scale',
  ],
} as const;

export const VERIFIED_IMPACT: VerifiedImpact[] = [
  {
    id: 'casey-production',
    metric: 'calls_initiated',
    value: '3,000+',
    context: 'Casey Voice production; ~12% lead conversion rate',
    confidence: 'measured',
    projectSlug: 'casey-ai',
  },
  {
    id: 'chase-onboarding',
    metric: 'accounts_created_lift',
    value: '30%',
    context: 'Chase MyHome onboarding redesign for new mortgage customers (2024)',
    confidence: 'verified',
    projectSlug: 'chase-myhome',
  },
  {
    id: 'chase-dropoff',
    metric: 'flow_drop_off',
    value: '18% → 6–10%',
    context: 'Chase MyHome mortgage application flows',
    confidence: 'verified',
    projectSlug: 'chase-myhome',
  },
  {
    id: 'salesforce-csat',
    metric: 'csat',
    value: 'Doubled',
    context: 'AI Contact Support at Salesforce; reduced case creation volume',
    confidence: 'verified',
    projectSlug: 'salesforce-help',
  },
];

export const PROFILE_ROLES: ProfileRole[] = [
  {
    id: 'jpmc-ai',
    company: 'JPMorgan Chase',
    role: 'Senior Product Designer — AI',
    period: 'Jul 2025 – Present',
    startDate: '2025-07',
    current: true,
    location: 'Plano, Texas, United States',
    employmentType: 'Full-time',
    summary:
      'Leads design for Casey AI, Chase\'s first consumer-facing AI agent for home lending—specialized in voice AI and conversational RCS.',
    responsibilities: [
      'Design conversational AI flows for complex banking use cases',
      'Work cross-functionally with AI engineers and Forward Deployed Engineers to ship agentic experiences',
      'Lead design thinking sessions for strategic AI implementation',
      'Conduct detailed QA for agentic edge-case prioritization and guardrail resolution',
      'Build and ship customer-centric UI through AI-native development processes',
      'Train and mentor junior designers on AI-native programming with Cursor, Claude Code, VSCode, and Figma MCP',
    ],
    outcomes: [
      'Casey AI shipped to production with voice and RCS channels',
      '3,000+ calls initiated at ~12% lead conversion in production',
    ],
    capabilities: ['Agentic AI', 'Voice UX', 'RCS', 'Regulated design', 'Design leadership'],
    relatedProjectSlugs: ['casey-ai'],
  },
  {
    id: 'jpmc-cmh',
    company: 'JPMorgan Chase',
    role: 'Senior Product Designer — Chase MyHome',
    period: 'Mar 2023 – Jul 2025',
    startDate: '2023-03',
    endDate: '2025-07',
    current: false,
    location: 'Plano, Texas, United States · Hybrid',
    employmentType: 'Full-time',
    summary:
      'Senior designer for Chase MyHome public and secure experiences—helping homeowners find, qualify for, and finance their dream homes.',
    responsibilities: [
      'Led strategic redesign and component migration for new Chase mortgage customer onboarding',
      'Contributed to Chase MyHome mortgage application flows',
      'Contributed to launching Chase HELOC, a 0-to-1 initiative for Home Equity Lines of Credit',
      'Created WCAG accessibility documentation',
      'Collaborated with engineering, product, legal, ADA, and strategy partners',
      'Contributed mobile-first components to the Manhattan Design System',
      'Mentored junior designers and authored internal Figma documentation',
    ],
    outcomes: [
      'Increased accounts created by 30% in 2024 through onboarding redesign',
      'Reduced individual drop-off rates from 18% to 6–10% in mortgage application flows',
      'Launched Chase HELOC for CMH customers',
    ],
    capabilities: ['Mobile UX', 'Onboarding', 'Accessibility', 'Design systems', 'Home lending'],
    relatedProjectSlugs: ['chase-myhome'],
  },
  {
    id: 'salesforce',
    company: 'Salesforce',
    role: 'Product Designer',
    period: 'Jun 2021 – Mar 2023',
    startDate: '2021-06',
    endDate: '2023-03',
    current: false,
    location: 'Dallas, TX · Remote',
    employmentType: 'Full-time',
    summary:
      'Designed and launched Contact Support, an AI-powered customer solution connecting enterprise customers with specialized Support Engineers.',
    responsibilities: [
      'Designed case submission experience for resolving complex enterprise problems',
      'Partnered with product and engineering on Einstein AI routing',
    ],
    outcomes: [
      'Doubled CSAT and reduced case creation volume',
      'Established baseline for future innovations in customer support AI agents',
    ],
    capabilities: ['AI UX', 'Enterprise support', 'Research synthesis'],
    relatedProjectSlugs: ['salesforce-help'],
  },
  {
    id: 'writer',
    company: 'WRITER',
    role: 'Product Designer',
    period: 'Jan 2021 – Jun 2021',
    startDate: '2021-01',
    endDate: '2021-06',
    current: false,
    location: 'San Francisco Bay Area · Remote',
    employmentType: 'Contract',
    summary:
      'Designed and launched ReWrite and Snippets features for enterprise content creation, improving usability, brand consistency, and governance.',
    responsibilities: [
      'Designed ReWrite, an AI-based paraphraser for content creation',
      'Designed Snippets for enterprise content storage and reuse',
      'Designed an AI-powered Figma plugin for content approvals and brand voice',
      'Collaborated on design system evolution and real-time AI suggestions',
    ],
    outcomes: [
      'Shipped ReWrite and Snippets to enterprise customers',
      'Accelerated content approvals through Figma plugin integration',
    ],
    capabilities: ['GenAI UX', 'Enterprise content', 'Design systems', 'Figma plugins'],
    relatedProjectSlugs: ['writer-ai'],
  },
  {
    id: 'chorus',
    company: 'Chorus.ai',
    role: 'Product Designer — AI',
    period: 'Jun 2020 – Jun 2021',
    startDate: '2020-06',
    endDate: '2021-06',
    current: false,
    location: 'Remote',
    employmentType: 'Contract',
    summary:
      'Built a scalable design system for Chorus AI, accelerating feature development during a period of strategic growth.',
    responsibilities: [
      'Designed and documented scalable design system components',
      'Contributed to product roadmap through systematized UI patterns',
    ],
    outcomes: [
      'Accelerated feature development through design system foundation',
      'Company acquired by ZoomInfo in July 2021',
    ],
    capabilities: ['Design systems', 'AI SaaS', 'Component libraries'],
  },
  {
    id: 'shift',
    company: 'Shift',
    role: 'Product Design Intern',
    period: 'Nov 2019 – Apr 2020',
    startDate: '2019-11',
    endDate: '2020-04',
    current: false,
    location: 'Vancouver, British Columbia, Canada',
    employmentType: 'Internship',
    summary:
      'Designed an analytics dashboard for enterprise Shift customers to manage employees and software subscription expenditure.',
    responsibilities: [
      'Led end-to-end design process for enterprise analytics dashboard',
      'Presented business case using real-world data through UBC Creative Destruction Lab partnership',
    ],
    outcomes: [
      'Delivered enterprise analytics concept for subscription management',
    ],
    capabilities: ['Analytics UX', 'Enterprise dashboards', 'Business case design'],
  },
];

/** Flat list compatible with legacy WorkExperience consumers. */
export function getWorkExperienceList() {
  return PROFILE_ROLES.map((role) => ({
    company: role.company,
    role: role.role,
    period: role.period,
    startYear: parseInt(role.startDate.slice(0, 4), 10),
    endYear: role.endDate ? parseInt(role.endDate.slice(0, 4), 10) : undefined,
    current: role.current,
  }));
}
