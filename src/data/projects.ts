import type { CSSProperties } from 'react';
import type { CaseStudyConfig } from '@/components/CaseStudyScrolly/types';

export interface ProjectStyles {
  backgroundColor?: string;
  backgroundGradient?: string;
  textColor?: string;
  titleColor?: string;
  customClassName?: string;
  customStyles?: CSSProperties;
}

export interface CaseStudyBlock {
  text: string;
  screenContent?: string;
}

export interface Project {
  id: string;
  title: string;
  tagline?: string;
  description?: string;
  year?: number;
  company?: string;
  role?: string;
  tags?: string[];
  thumbnail?: string;
  slug: string;
  styles?: ProjectStyles;
  caseStudy?: {
    blocks: CaseStudyBlock[];
  };
  scrollyConfig?: CaseStudyConfig;
}

export const projects: Project[] = [
  {
    id: 'memento-ai',
    title: 'Memento AI',
    tagline: 'A personal memory companion that surfaces the right context at the right time.',
    description: 'AI-powered memory and journaling experience that learns from your life.',
    year: 2023,
    company: 'Personal Project',
    role: 'Designer & Developer',
    tags: ['AI', 'Mobile', 'Personal'],
    thumbnail: '/assets/memento-ai.png',
    slug: 'memento-ai',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'Memento AI is a personal memory companion that surfaces the right context at the right time. The challenge was designing an AI experience that felt genuinely helpful without being intrusive — something that learns from your life without making you feel surveilled.' },
        { text: 'The core interaction model centers on passive capture and active recall. Users speak or type naturally; Memento structures, tags, and connects entries automatically.' },
        { text: 'After three rounds of usability testing, the key insight was that memory apps fail when they ask too much of users. Memento succeeds by asking almost nothing.' },
      ],
    },
    scrollyConfig: {
      slug: 'memento-ai',
      title: 'Memento AI',
      trackHeightVh: 500,
      stage: { centerpiece: { frame: 'phone', width: 260, src: '/assets/memento-ai.png' } },
      beats: [
        { id: 'challenge', label: 'Challenge', headline: 'Memory apps fail because they ask too much of you.', body: 'Memento AI is a personal memory companion that surfaces the right context at the right time. The challenge was designing an AI experience that felt genuinely helpful without being intrusive — something that learns from your life without making you feel surveilled.', range: [0, 0.25] },
        { id: 'approach',  label: 'Approach',  headline: 'We studied how people actually recall what matters.', body: 'The core interaction model centers on passive capture and active recall. Users speak or type naturally; Memento structures, tags, and connects entries automatically. The assistant surfaces relevant memories when you need them — before a meeting, during a conversation, or while planning.', range: [0.25, 0.5] },
        { id: 'solution',  label: 'Solution',  headline: 'Passive capture. Active recall. Zero friction.', body: 'After three rounds of usability testing, the key insight was that memory apps fail when they ask too much of users. Memento succeeds by asking almost nothing. The final experience reduced active input time by 80% while increasing meaningful recall by 3×.', range: [0.5, 0.75] },
        { id: 'results',   label: 'Results',   headline: '80% less input. 3× more meaningful recall.', range: [0.75, 1.0] },
      ],
      cards: [
        { id: 'c1', label: 'Research notes', seed: 11, enterAt: 0.14, clusterId: 'discovery', bgColor: '#1e2a1e' },
        { id: 'c2', label: 'Pain points', seed: 22, enterAt: 0.17, clusterId: 'discovery', bgColor: '#1a2520' },
        { id: 'c3', label: 'Journey map', seed: 33, enterAt: 0.20, clusterId: 'research', bgColor: '#1e1e2a' },
        { id: 'c4', label: 'Capture flows', seed: 44, enterAt: 0.23, clusterId: 'research', bgColor: '#1a1a25' },
        { id: 'c5', label: 'Recall UI', seed: 55, enterAt: 0.26, clusterId: 'shipped', bgColor: '#2a1e1e' },
        { id: 'c6', label: 'Final design', seed: 66, enterAt: 0.29, clusterId: 'shipped', bgColor: '#251a1a' },
        { id: 'c7', label: '−80% input time', seed: 77, enterAt: 0.32, clusterId: 'impact', bgColor: '#1a1e2a' },
        { id: 'c8', label: 'Prototype v3', seed: 88, enterAt: 0.16, bgColor: '#222222' },
      ],
      clusters: [
        { id: 'discovery', label: 'Discovery',   anchor: { x: 18, y: 28 } },
        { id: 'research',  label: 'Research',    anchor: { x: 82, y: 28 } },
        { id: 'shipped',   label: 'Shipped',     anchor: { x: 18, y: 72 } },
        { id: 'impact',    label: 'Impact',      anchor: { x: 82, y: 72 } },
      ],
    },
  },
  {
    id: 'autods-m-ai',
    title: 'AutoDSM AI',
    tagline: 'An AI-powered design system manager that keeps tokens, components, and documentation in sync.',
    description: 'Intelligent design system management platform for enterprise product teams.',
    year: 2023,
    company: 'Personal Project',
    role: 'Designer & Developer',
    tags: ['AI', 'Design Systems', 'B2B'],
    slug: 'autods-m-ai',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'AutoDSM AI is an intelligent design system manager that keeps tokens, components, and documentation in sync across design tools and codebases. Design system drift is invisible until it becomes catastrophic.' },
        { text: 'The product scans Figma files and GitHub repos simultaneously, detecting divergence between the two. AutoDSM surfaces conflicts and proposes resolutions automatically.' },
        { text: 'Designing for power users who resist new tools was the central challenge. The solution was zero-friction integration: works inside Figma, inside VS Code, inside their existing PR workflow.' },
      ],
    },
    scrollyConfig: {
      slug: 'autods-m-ai',
      title: 'AutoDSM AI',
      trackHeightVh: 500,
      stage: { centerpiece: { frame: 'browser', width: 400 } },
      beats: [
        { id: 'challenge', label: 'Challenge', headline: 'Design system drift is invisible until it\'s catastrophic.', body: 'AutoDSM AI is an intelligent design system manager that keeps tokens, components, and documentation in sync across design tools and codebases. It was born from a real frustration: design system drift is invisible until it becomes catastrophic.', range: [0, 0.25] },
        { id: 'approach',  label: 'Approach',  headline: 'Two tools, one source of truth — constantly out of sync.', body: 'The product scans Figma files and GitHub repos simultaneously, detecting divergence between the two. When a token changes in code but not in Figma — or vice versa — AutoDSM surfaces the conflict and proposes a resolution. The AI drafts changelog entries, migration guides, and updated documentation automatically.', range: [0.25, 0.5] },
        { id: 'solution',  label: 'Solution',  headline: 'AutoDSM watches both sides and resolves the conflict.', body: 'Designing for power users who resist new tools was the central challenge. The solution was zero-friction integration: AutoDSM works where designers and engineers already are — inside Figma, inside VS Code, inside their existing PR workflow. No new dashboard to learn.', range: [0.5, 0.75] },
        { id: 'results',   label: 'Results',   headline: 'Zero new dashboard. Lives where you already work.', range: [0.75, 1.0] },
      ],
      cards: [
        { id: 'c1', label: 'Figma audit', seed: 12, enterAt: 0.14, clusterId: 'discovery', bgColor: '#1e1e2a' },
        { id: 'c2', label: 'Drift examples', seed: 23, enterAt: 0.17, clusterId: 'discovery', bgColor: '#1a1a25' },
        { id: 'c3', label: 'Token conflicts', seed: 34, enterAt: 0.20, clusterId: 'research', bgColor: '#1e2a1e' },
        { id: 'c4', label: 'PR workflow', seed: 45, enterAt: 0.23, clusterId: 'research', bgColor: '#1a2520' },
        { id: 'c5', label: 'Diff view', seed: 56, enterAt: 0.26, clusterId: 'shipped', bgColor: '#2a1e1e' },
        { id: 'c6', label: 'Resolve UI', seed: 67, enterAt: 0.29, clusterId: 'shipped', bgColor: '#251a1a' },
        { id: 'c7', label: '0 new tabs', seed: 78, enterAt: 0.32, clusterId: 'impact', bgColor: '#1a1e2a' },
        { id: 'c8', label: 'User interview', seed: 89, enterAt: 0.15, bgColor: '#222222' },
      ],
      clusters: [
        { id: 'discovery', label: 'Discovery',   anchor: { x: 18, y: 28 } },
        { id: 'research',  label: 'Research',    anchor: { x: 82, y: 28 } },
        { id: 'shipped',   label: 'Shipped',     anchor: { x: 18, y: 72 } },
        { id: 'impact',    label: 'Impact',      anchor: { x: 82, y: 72 } },
      ],
    },
  },
  {
    id: 'casey-ai',
    title: 'Casey AI',
    tagline: 'Voice and RCS-powered AI banking assistant for conversational money management.',
    description: 'Conversational AI across voice and RCS messaging for Chase customers.',
    year: 2024,
    company: 'JPMorgan Chase',
    role: 'Senior Product Designer',
    tags: ['Agentic AI', 'Voice', 'RCS', 'Banking'],
    thumbnail: '/assets/casey-ai.png',
    slug: 'casey-ai',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'Casey AI is a voice and RCS-powered banking assistant that lets Chase customers manage their money through natural conversation. Making AI-driven financial tasks feel safe without sacrificing precision.' },
        { text: 'RCS brought a new design surface: rich media cards, suggested reply chips, and persistent threads. The interaction grammar had to work across both voice and RCS — two completely different modalities.' },
        { text: 'The hardest problem was confirmation design. We designed a three-stage pattern — summary, preview, biometric — reducing transaction abandonment by 34% with zero fraud escalations in pilot.' },
      ],
    },
    scrollyConfig: {
      slug: 'casey-ai',
      title: 'Casey AI',
      trackHeightVh: 500,
      stage: { centerpiece: { frame: 'phone', width: 260, src: '/assets/casey-ai.png' } },
      beats: [
        { id: 'challenge', label: 'Challenge', headline: 'Financial AI that feels safe — not just smart.', body: 'Casey AI is a voice and RCS-powered banking assistant that lets Chase customers manage their money through natural conversation. The design challenge was making AI-driven financial tasks feel safe, trustworthy, and effortlessly simple — without sacrificing the precision financial transactions require.', range: [0, 0.25] },
        { id: 'approach',  label: 'Approach',  headline: 'Voice and RCS need completely different design grammars.', body: 'RCS brought a new design surface: rich media cards, suggested reply chips, and persistent conversation threads that live natively in the messaging app. The interaction grammar had to work across both voice (where visual feedback is absent) and RCS (where visual hierarchy is everything).', range: [0.25, 0.5] },
        { id: 'solution',  label: 'Solution',  headline: 'Three-stage confirmation: summary, preview, biometric.', body: 'The hardest problem was confirmation design. When an AI is about to move money, the user needs absolute confidence. We designed a three-stage confirmation pattern — summary, preview, and biometric confirmation — that reduced transaction abandonment by 34% versus the legacy flow.', range: [0.5, 0.75] },
        { id: 'results',   label: 'Results',   headline: '34% less abandonment. Zero fraud escalations in pilot.', range: [0.75, 1.0] },
      ],
      cards: [
        { id: 'c1', label: 'Trust research', seed: 13, enterAt: 0.14, clusterId: 'discovery', bgColor: '#1e1e2a' },
        { id: 'c2', label: 'Voice flows', seed: 24, enterAt: 0.17, clusterId: 'discovery', bgColor: '#1a1a25' },
        { id: 'c3', label: 'RCS patterns', seed: 35, enterAt: 0.20, clusterId: 'research', bgColor: '#1e2a1e' },
        { id: 'c4', label: 'Confirm states', seed: 46, enterAt: 0.23, clusterId: 'research', bgColor: '#1a2520' },
        { id: 'c5', label: 'Biometric UI', seed: 57, enterAt: 0.26, clusterId: 'shipped', bgColor: '#2a1e1e' },
        { id: 'c6', label: 'RCS card', seed: 68, enterAt: 0.29, clusterId: 'shipped', bgColor: '#251a1a' },
        { id: 'c7', label: '−34% abandon', seed: 79, enterAt: 0.32, clusterId: 'impact', bgColor: '#1a1e2a' },
        { id: 'c8', label: 'Edge cases', seed: 90, enterAt: 0.15, bgColor: '#222222' },
      ],
      clusters: [
        { id: 'discovery', label: 'Discovery',   anchor: { x: 18, y: 28 } },
        { id: 'research',  label: 'Research',    anchor: { x: 82, y: 28 } },
        { id: 'shipped',   label: 'Shipped',     anchor: { x: 18, y: 72 } },
        { id: 'impact',    label: 'Impact',      anchor: { x: 82, y: 72 } },
      ],
    },
  },
  {
    id: 'chase-myhome',
    title: 'Chase MyHome App',
    tagline: 'A unified home ownership platform connecting mortgage, equity, and market insights.',
    description: 'End-to-end homeownership experience for JPMorgan Chase customers.',
    year: 2024,
    company: 'JPMorgan Chase',
    role: 'Senior Product Designer',
    tags: ['Mobile', 'Banking', 'Home Ownership'],
    thumbnail: '/assets/chase-myhome.png',
    slug: 'chase-myhome',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'Chase MyHome is a unified homeownership platform connecting mortgage, equity, and market insights in a single app. For most Americans, their home is their largest financial asset — yet they have almost no tools to actively manage it.' },
        { text: 'The central challenge was information architecture. A homeowner\'s financial picture spans mortgage, equity, rates, taxes, insurance, and payments. Surfacing the right signal without overwhelming required deep research into mental models.' },
        { text: 'We introduced a Home Value Dashboard paired with an Equity Builder. Users said: "The first time I actually understood where my money was going."' },
      ],
    },
    scrollyConfig: {
      slug: 'chase-myhome',
      title: 'Chase MyHome App',
      trackHeightVh: 500,
      stage: { centerpiece: { frame: 'phone', width: 260, src: '/assets/chase-myhome.png' } },
      beats: [
        { id: 'challenge', label: 'Challenge', headline: 'Your largest asset — with almost no tools to manage it.', body: 'Chase MyHome is a unified homeownership platform that connects mortgage, equity, and market insights in a single app experience. For most Americans, their home is their largest financial asset — but they have almost no tools to manage it actively. MyHome changes that.', range: [0, 0.25] },
        { id: 'approach',  label: 'Approach',  headline: 'How people actually think about home equity over time.', body: 'The central challenge was information architecture. A homeowner\'s financial picture includes mortgage balance, home value, equity, rates, taxes, insurance, and upcoming payments. Surfacing the most relevant signal at any moment — without overwhelming — required extensive research into how people actually think about their home equity over time.', range: [0.25, 0.5] },
        { id: 'solution',  label: 'Solution',  headline: 'Home Value Dashboard + Equity Builder in one view.', body: 'We introduced a Home Value Dashboard that updates quarterly with real market data, paired with an Equity Builder showing the user exactly how each payment accelerates ownership. In usability testing, users described the equity visualization as "the first time I actually understood where my money was going."', range: [0.5, 0.75] },
        { id: 'results',   label: 'Results',   headline: '"The first time I actually understood where my money was going."', range: [0.75, 1.0] },
      ],
      cards: [
        { id: 'c1', label: 'Customer interviews', seed: 14, enterAt: 0.14, clusterId: 'discovery', bgColor: '#1e2a20' },
        { id: 'c2', label: 'Mental models', seed: 25, enterAt: 0.17, clusterId: 'discovery', bgColor: '#1a251c' },
        { id: 'c3', label: 'IA mapping', seed: 36, enterAt: 0.20, clusterId: 'research', bgColor: '#1e1e2a' },
        { id: 'c4', label: 'Equity flows', seed: 47, enterAt: 0.23, clusterId: 'research', bgColor: '#1a1a25' },
        { id: 'c5', label: 'Dashboard', seed: 58, enterAt: 0.26, clusterId: 'shipped', bgColor: '#2a1e1e' },
        { id: 'c6', label: 'Equity builder', seed: 69, enterAt: 0.29, clusterId: 'shipped', bgColor: '#251a1a' },
        { id: 'c7', label: 'CSAT +41pts', seed: 80, enterAt: 0.32, clusterId: 'impact', bgColor: '#1a1e2a' },
        { id: 'c8', label: 'Prototype', seed: 91, enterAt: 0.16, bgColor: '#222222' },
      ],
      clusters: [
        { id: 'discovery', label: 'Discovery',   anchor: { x: 18, y: 28 } },
        { id: 'research',  label: 'Research',    anchor: { x: 82, y: 28 } },
        { id: 'shipped',   label: 'Shipped',     anchor: { x: 18, y: 72 } },
        { id: 'impact',    label: 'Impact',      anchor: { x: 82, y: 72 } },
      ],
    },
  },
  {
    id: 'agentic-home-lending',
    title: 'Agentic Home Lending',
    tagline: 'AI-guided mortgage origination that turns a months-long process into days.',
    description: 'Agentic AI flows for the JPMorgan Chase home lending origination experience.',
    year: 2024,
    company: 'JPMorgan Chase',
    role: 'Senior Product Designer',
    tags: ['Agentic AI', 'Banking', 'Mortgage'],
    thumbnail: '/assets/agentic-home-lending.png',
    slug: 'agentic-home-lending',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'Agentic Home Lending redesigns the JPMorgan Chase mortgage origination experience — turning a process that took 45 days of back-and-forth into a guided, intelligent flow that adapts to each applicant.' },
        { text: 'The agentic model means the system proactively works on the user\'s behalf: requesting the right documents, flagging issues before underwriting, surfacing alternatives. A knowledgeable guide, not just a form wizard.' },
        { text: 'We introduced a Progress Certainty Score — a real-time confidence indicator. Pilot results: 41% reduction in time-to-close, 28% fewer document re-requests, NPS from 22 to 61.' },
      ],
    },
    scrollyConfig: {
      slug: 'agentic-home-lending',
      title: 'Agentic Home Lending',
      trackHeightVh: 500,
      stage: { centerpiece: { frame: 'phone', width: 260, src: '/assets/agentic-home-lending.png' } },
      beats: [
        { id: 'challenge', label: 'Challenge', headline: '45 days of back-and-forth document exchanges.', body: 'Agentic Home Lending redesigns the JPMorgan Chase mortgage origination experience using agentic AI — turning a process that previously took 45 days of back-and-forth document exchanges into a guided, intelligent flow that adapts to each applicant\'s unique situation.', range: [0, 0.25] },
        { id: 'approach',  label: 'Approach',  headline: 'A guide that works on your behalf — not just a form wizard.', body: 'The agentic model means the system proactively works on the user\'s behalf: requesting the right documents at the right time, explaining why each is needed, flagging potential issues before underwriting, and surfacing alternative loan products when the primary option doesn\'t fit. The AI acts as a knowledgeable guide, not just a form wizard.', range: [0.25, 0.5] },
        { id: 'solution',  label: 'Solution',  headline: 'Progress Certainty Score: know exactly where you stand.', body: 'Designing for trust in a high-stakes financial transaction required extreme clarity at every step. We introduced a Progress Certainty Score — a real-time confidence indicator showing applicants exactly where they stood in the process. Pilot results: 41% reduction in time-to-close, 28% reduction in document re-requests, and NPS improvement from 22 to 61.', range: [0.5, 0.75] },
        { id: 'results',   label: 'Results',   headline: '41% faster close. NPS from 22 to 61.', range: [0.75, 1.0] },
      ],
      cards: [
        { id: 'c1', label: 'Loan officer shadows', seed: 15, enterAt: 0.14, clusterId: 'discovery', bgColor: '#1e1e2a' },
        { id: 'c2', label: 'Doc failure modes', seed: 26, enterAt: 0.17, clusterId: 'discovery', bgColor: '#1a1a25' },
        { id: 'c3', label: 'Agent model', seed: 37, enterAt: 0.20, clusterId: 'research', bgColor: '#1e2a1e' },
        { id: 'c4', label: 'Trust triggers', seed: 48, enterAt: 0.23, clusterId: 'research', bgColor: '#1a2520' },
        { id: 'c5', label: 'Certainty score', seed: 59, enterAt: 0.26, clusterId: 'shipped', bgColor: '#2a1e20' },
        { id: 'c6', label: 'Agent surface', seed: 70, enterAt: 0.29, clusterId: 'shipped', bgColor: '#251a1c' },
        { id: 'c7', label: 'NPS 22→61', seed: 81, enterAt: 0.32, clusterId: 'impact', bgColor: '#1a1e2a' },
        { id: 'c8', label: 'Scenario map', seed: 92, enterAt: 0.15, bgColor: '#222222' },
      ],
      clusters: [
        { id: 'discovery', label: 'Discovery',   anchor: { x: 18, y: 28 } },
        { id: 'research',  label: 'Research',    anchor: { x: 82, y: 28 } },
        { id: 'shipped',   label: 'Shipped',     anchor: { x: 18, y: 72 } },
        { id: 'impact',    label: 'Impact',      anchor: { x: 82, y: 72 } },
      ],
    },
  },
  {
    id: 'salesforce-help',
    title: 'Salesforce Help',
    tagline: 'A redesigned help and contact support experience serving 150,000+ enterprise users.',
    description: 'Redesigned contact support and help flows for Salesforce enterprise customers.',
    year: 2022,
    company: 'Salesforce',
    role: 'Product Designer',
    tags: ['Enterprise', 'Service Cloud', 'Self-Service'],
    slug: 'salesforce-help',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'Salesforce Help — Contact Support is a redesigned self-service experience serving 150,000+ enterprise customers. The existing flow required an average of 7 screens just to open a simple support case.' },
        { text: 'Two-week research sprint: shadowing support agents, interviewing admins, analyzing 30,000 tickets. Core insight: 68% of tickets could be resolved with the right doc — but users couldn\'t find it before escalating.' },
        { text: 'New experience surfaces contextual docs before the form. Case creation: 3 screens. Post-launch: 31% fewer cases, $4.2M saved annually, CSAT from 3.4 → 4.6.' },
      ],
    },
    scrollyConfig: {
      slug: 'salesforce-help',
      title: 'Salesforce Help',
      trackHeightVh: 500,
      stage: { centerpiece: { frame: 'browser', width: 400 } },
      beats: [
        { id: 'challenge', label: 'Challenge', headline: '7 screens to open a simple support case.', body: 'Salesforce Help — Contact Support is a redesigned self-service and case creation experience serving 150,000+ enterprise customers. The existing flow had been layered with functionality over years without a holistic design pass, resulting in a support experience that required an average of 7 screens to open a simple support case.', range: [0, 0.25] },
        { id: 'approach',  label: 'Approach',  headline: '68% of tickets could be resolved with the right doc.', body: 'The redesign began with a two-week research sprint: shadowing support agents, interviewing enterprise admins, and analyzing 30,000 support tickets to identify the most common paths and failure points. The core insight was that 68% of tickets could be resolved with the right documentation — but users couldn\'t find it before escalating.', range: [0.25, 0.5] },
        { id: 'solution',  label: 'Solution',  headline: 'Contextual docs first. Case form in 3 screens.', body: 'The new experience surfaces contextual documentation before the case form, using the user\'s org config and recent activity to serve relevant articles first. When case creation is needed, the redesigned form completes in 3 screens. Post-launch metrics: 31% reduction in case volume, $4.2M annual support cost savings, CSAT improvement from 3.4 to 4.6 out of 5.', range: [0.5, 0.75] },
        { id: 'results',   label: 'Results',   headline: '31% fewer cases. $4.2M saved. CSAT 3.4 → 4.6.', range: [0.75, 1.0] },
      ],
      cards: [
        { id: 'c1', label: 'Agent shadowing', seed: 16, enterAt: 0.14, clusterId: 'discovery', bgColor: '#1e2a1e' },
        { id: 'c2', label: '30K tickets', seed: 27, enterAt: 0.17, clusterId: 'discovery', bgColor: '#1a251a' },
        { id: 'c3', label: 'Path analysis', seed: 38, enterAt: 0.20, clusterId: 'research', bgColor: '#1e1e2a' },
        { id: 'c4', label: 'Doc relevance', seed: 49, enterAt: 0.23, clusterId: 'research', bgColor: '#1a1a25' },
        { id: 'c5', label: 'Contextual surface', seed: 60, enterAt: 0.26, clusterId: 'shipped', bgColor: '#2a201e' },
        { id: 'c6', label: '3-screen form', seed: 71, enterAt: 0.29, clusterId: 'shipped', bgColor: '#251c1a' },
        { id: 'c7', label: '$4.2M saved', seed: 82, enterAt: 0.32, clusterId: 'impact', bgColor: '#1a1e2a' },
        { id: 'c8', label: 'Failure modes', seed: 93, enterAt: 0.15, bgColor: '#222222' },
      ],
      clusters: [
        { id: 'discovery', label: 'Discovery',   anchor: { x: 18, y: 28 } },
        { id: 'research',  label: 'Research',    anchor: { x: 82, y: 28 } },
        { id: 'shipped',   label: 'Shipped',     anchor: { x: 18, y: 72 } },
        { id: 'impact',    label: 'Impact',      anchor: { x: 82, y: 72 } },
      ],
    },
  },
];
