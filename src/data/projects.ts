import type { CSSProperties } from 'react';
import type { CaseStudyConfig } from '@/components/CaseStudyScrolly/types';
import { ASSETS } from '@/data/assets';
import { PHONE_SCREEN_AR } from '@/components/PhoneStencil/phone-aspect-ratios';

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

export interface ProjectPreview {
  frame: 'phone' | 'browser' | 'image' | 'fill';
  src?: string;
  video?: string;
  url?: string;
  screenAspectRatio?: number;
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
  preview?: ProjectPreview;
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
    tagline: 'A native iOS journaling app where localized RAG turns your own writing into a therapeutic mirror.',
    description: 'I designed and engineered Memento, a native iOS journaling app utilizing a localized Retrieval-Augmented Generation (RAG) architecture to provide contextual, fully cited AI reflections grounded exclusively in the user\'s own writing.',
    year: 2023,
    company: 'Personal Project',
    role: 'Designer & Developer',
    tags: ['AI', 'Mobile', 'Personal'],
    thumbnail: '/assets/memento-ai.png',
    preview: { frame: 'phone', src: '/assets/memento-ai.png', screenAspectRatio: PHONE_SCREEN_AR.mementoPreview },
    slug: 'memento-ai',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'I designed and engineered Memento, a native iOS journaling app utilizing a localized Retrieval-Augmented Generation (RAG) architecture to provide contextual, fully cited AI reflections grounded exclusively in the user\'s own writing.' },
        { text: 'The product vision was to shift AI from a high-speed productivity utility into a slow, therapeutic mirror for self-reflection. I owned the entire stack, from UI design to the data embedding pipeline, to build an experience that feels purely meditative rather than transactional. I rejected standard engagement mechanics like push notifications and streaks in favor of a minimalist, text-driven conversational loop where writing naturally begets more writing.' },
        { text: 'A journal requires absolute psychological safety, but standard AI integrations often turn intimate reflection into an intrusive experience. Generic language models generate synthesized, impersonal responses that can distort a writer\'s true voice, while un-cited AI insights leave users feeling exposed and uneasy.' },
        { text: 'The resulting interface centers on a minimalist editorial loop where the act of writing naturally opens the path for the next entry. I also designed a dedicated "Dive Deeper" panel that displays the exact historical entries the AI referenced, providing immediate data transparency and contextual source citations. Early testing shows that when users feel psychologically safe, their writing frequency and depth increase, proving that absolute privacy acts as a powerful product differentiator.' },
      ],
    },
    scrollyConfig: {
      slug: 'memento-ai',
      title: 'Memento AI',
      trackHeightVh: 600,
      stage: {
        centerpiece: {
          frame: 'phone',
          width: 260,
          video: ASSETS.video.mementoDemo,
          screenAspectRatio: PHONE_SCREEN_AR.mementoDemo,
        },
      },
      beats: [
        { id: 'summary',   headline: 'AI as a slow, therapeutic mirror for self-reflection.', body: 'I designed and engineered Memento, a native iOS journaling app utilizing a localized RAG architecture to provide contextual, fully cited AI reflections grounded exclusively in the user\'s own writing.', range: [0, 0.15] },
        { id: 'tldr',      label: 'TL;DR',     headline: 'Psychological safety is the foundational requirement of any journal.', body: 'The product vision was to shift AI from a high-speed productivity utility into a slow, therapeutic mirror. I owned the entire stack, from UI design to the data embedding pipeline, building an experience that feels purely meditative rather than transactional. I rejected push notifications and streaks in favor of a minimalist loop where writing naturally begets more writing.', range: [0.15, 0.32] },
        { id: 'challenge', label: 'Challenge', headline: 'Standard AI integrations turn intimate reflection into surveillance.', body: 'A journal requires absolute psychological safety, but standard AI integrations often turn intimate reflection into an intrusive experience. Generic language models generate synthesized, impersonal responses that can distort a writer\'s true voice, while un-cited AI insights leave users feeling exposed and uneasy.', range: [0.32, 0.50] },
        { id: 'approach',  label: 'Approach',  headline: 'The AI could only speak from the user\'s own words.', body: 'I prioritized slow, intentional reflection over rapid-fire transactional mechanics. Instead of artificial rewards or notifications, the intrinsic value of self-discovery drives the experience. I established a strict architectural constraint: the AI could only converse using the user\'s explicit historical entries, ensuring every interaction felt deeply personal and authentic.', range: [0.50, 0.67] },
        { id: 'solution',  label: 'Solution',  headline: 'Writing naturally opens the path for the next entry.', body: 'The interface centers on a minimalist editorial loop: after logging thoughts, the AI poses a single contextual follow-up question; tapping it pulls up a clean canvas for the next reflection. A dedicated "Dive Deeper" panel displays the exact historical entries the AI referenced, providing immediate data transparency and source citations.', range: [0.67, 0.83] },
        { id: 'outcome',   label: 'Outcome',   headline: 'Absolute privacy is a powerful product differentiator.', body: 'By treating AI as a quiet mirror rather than an active content generator, the app has validated its core product vision: that intentional architectural constraint builds deeper engagement. Early testing shows that when users feel psychologically safe, their writing frequency and depth increase. A closed beta is underway ahead of public launch.', range: [0.83, 1.0] },
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
    preview: { frame: 'image', src: '/assets/autods-m.webp' },
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
      trackHeightVh: 600,
      stage: { centerpiece: { frame: 'none', width: 400, src: '/assets/autods-m.webp' } },
      beats: [
        { id: 'summary',   headline: 'An AI-powered design system manager that keeps tokens, components, and documentation in sync.', body: 'AutoDSM AI detects when design and code drift apart by scanning Figma and GitHub simultaneously, then resolves conflicts and updates documentation automatically. It lives inside the tools designers and engineers already use: no new dashboards, no new workflows.', range: [0, 0.15] },
        { id: 'challenge', label: 'Challenge', headline: 'Design system drift is invisible until it\'s catastrophic.', body: 'AutoDSM AI is an intelligent design system manager that keeps tokens, components, and documentation in sync across design tools and codebases. It was born from a real frustration: design system drift is invisible until it becomes catastrophic.', range: [0.15, 0.32] },
        { id: 'approach',  label: 'Approach',  headline: 'Two tools, one source of truth, constantly out of sync.', body: 'The product scans Figma files and GitHub repos simultaneously, detecting divergence between the two. When a token changes in code but not in Figma, or vice versa, AutoDSM surfaces the conflict and proposes a resolution. The AI drafts changelog entries, migration guides, and updated documentation automatically.', range: [0.32, 0.50] },
        { id: 'solution',  label: 'Solution',  headline: 'AutoDSM watches both sides and resolves the conflict.', body: 'Designing for power users who resist new tools was the central challenge. The solution was zero-friction integration: AutoDSM works inside Figma, inside VS Code, and inside existing PR workflows. No new dashboard to learn.', range: [0.50, 0.68] },
        { id: 'results',   label: 'Results',   headline: 'Zero new dashboard. Lives where you already work.', range: [0.68, 0.85] },
        { id: 'tldr',      label: 'TLDR',      headline: 'The quick version.', body: 'Design system drift is invisible until it causes real damage. AutoDSM was built to catch it the moment it happens. The product scans Figma files and GitHub repos simultaneously, detecting divergence and proposing resolutions automatically. The critical design constraint was zero-friction adoption: it had to work inside Figma, VS Code, and existing PR workflows without asking power users to change anything. The result is consistent design systems at scale, with no new dashboard and no new processes.', range: [0.85, 1.0] },
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
    tagline: "Chase's first consumer AI agent",
    description: 'Voice and text agent for Chase Home Lending — re-engages mid-mortgage applicants and hands off to a human advisor.',
    year: 2025,
    company: 'JPMorgan Chase',
    role: 'Senior Product Designer',
    tags: ['Agentic AI', 'Voice', 'RCS', 'Home Lending'],
    thumbnail: '/assets/casey-ai.png',
    preview: { frame: 'phone', src: '/assets/casey-ai.png', screenAspectRatio: PHONE_SCREEN_AR.caseyPreview },
    slug: 'casey-ai',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'Casey is a voice and text agent for Chase Home Lending, built to re-engage people mid-mortgage and connect them to a human advisor at the right moment. The core tension: introducing AI at trust-critical steps inside one of the most heavily regulated conversations in consumer finance.' },
        { text: 'Research showed drop-off was a personalization gap, not a broken funnel. Customers wanted AI to reach an advisor faster, not replace one. Casey was framed as a connective agent measured by clean handoffs, with design principles anchored to a neighbor-at-the-branch persona.' },
        { text: 'Casey Voice qualifies leads and passes context into Salesforce before handoff; Casey RCS recovers abandoned applicants via magic links and inline answers. Compliance constraints shaped the experience, from conversational disclosures to weekly red-teaming. Production results: 3,000+ calls initiated at a ~12% lead conversion rate.' },
      ],
    },
    scrollyConfig: {
      slug: 'casey-ai',
      title: 'Casey AI',
      trackHeightVh: 600,
      stage: {
        centerpiece: {
          frame: 'phone',
          width: 260,
          video: ASSETS.video.caseyRcs,
          screenAspectRatio: PHONE_SCREEN_AR.caseyRcs,
        },
      },
      beats: [
        { id: 'summary',   headline: "Chase's first consumer AI agent", body: 'Casey is a voice and text agent for Chase Home Lending customers, built to re-engage people mid-mortgage and connect them to a human advisor at the right moment. Its core tension: introducing AI at the exact points customers said they wanted a person, inside one of the most heavily regulated conversations in consumer finance.', range: [0, 0.15] },
        { id: 'challenge', label: 'Challenge', headline: 'Customers left when the stakes got high', body: "Chase was losing mortgage applicants at the highest-stakes steps, like rates, terms, and long-term commitments, even though the funnel was already well-optimized and the usual fixes were exhausted. It was hard on two fronts: the drop-off sat at the emotional peak of the process, where trust mattered most, and everything the agent could say was bound by lending law, from mandated disclosures to financial advice it legally couldn't give.", range: [0.15, 0.32] },
        { id: 'approach',  label: 'Approach',  headline: 'Drop-off was a personalization gap', body: 'Instead of running more UI experiments, I partnered with research to ask why people left, not where. The answer was that drop-offs came from missing personalization, and customers wanted AI to get them to an advisor faster, not to replace one. So I framed Casey as a connective agent measured by clean handoffs rather than self-service resolution, and gave the team four principles to design against, presence during uncertainty, support over replacement, clarity over completion, and trust through restraint, anchored to one persona: a neighbor who works at the local Chase branch.', range: [0.32, 0.50] },
        { id: 'solution',  label: 'Solution',  headline: 'Two agents, one job: warm the lead, hand it off', body: "Casey Voice reaches customers who gave consent during their application, understands their needs, passes what it learns into Salesforce, and brings in a human advisor once they're ready. Casey RCS recovers people who abandon the flow, texting a magic link back to where they left off and answering questions inline from the ChaseMyHome knowledge base. Three constraint decisions made this viable inside a bank: opening calls with a name confirmation so a mandated 10-second disclosure lands as conversation, running voice auditions that produced Chase's first trademarked AI voice, and red-teaming Casey in weekly open sessions to harden guardrails around advice, rate guarantees, and fair lending.", range: [0.50, 0.68] },
        { id: 'results',   label: 'Results',   headline: '3,000+ calls initiated at a ~12% lead conversion rate, now handling thousands of interactions with minimal human review.', range: [0.68, 0.85] },
        { id: 'tldr',      label: 'TLDR',      headline: 'The quick version.', body: "Chase kept losing mortgage applicants at the highest-stakes steps, and research showed the cause was missing personalization, not a broken funnel. The insight was that customers didn't want AI to replace their advisor, they wanted it to reach one faster. So I designed Casey, a voice and text agent that qualifies and warms the lead before handing off to a human, with the hardest work spent making legal disclosures and compliance guardrails feel like a natural conversation. Casey shipped to production, with RCS launching May 2026 on iOS and Android, and now initiates 3,000+ calls at a ~12% conversion rate. It became the first time Chase trusted an AI agent to represent the brand without a human on every interaction.", range: [0.85, 1.0] },
      ],
      cards: [
        { id: 'c1', label: 'Drop-off research', seed: 13, enterAt: 0.14, clusterId: 'discovery', bgColor: '#1e1e2a' },
        { id: 'c2', label: 'Why people left', seed: 24, enterAt: 0.17, clusterId: 'discovery', bgColor: '#1a1a25' },
        { id: 'c3', label: 'Design principles', seed: 35, enterAt: 0.20, clusterId: 'research', bgColor: '#1e2a1e' },
        { id: 'c4', label: 'Neighbor persona', seed: 46, enterAt: 0.23, clusterId: 'research', bgColor: '#1a2520' },
        { id: 'c5', label: 'Casey Voice', seed: 57, enterAt: 0.26, clusterId: 'shipped', bgColor: '#2a1e1e' },
        { id: 'c6', label: 'Casey RCS', seed: 68, enterAt: 0.29, clusterId: 'shipped', bgColor: '#251a1a' },
        { id: 'c7', label: '3,000+ calls', seed: 79, enterAt: 0.32, clusterId: 'impact', bgColor: '#1a1e2a' },
        { id: 'c8', label: 'Red-teaming', seed: 90, enterAt: 0.15, bgColor: '#222222' },
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
    preview: { frame: 'phone', src: '/assets/chase-myhome.png', screenAspectRatio: PHONE_SCREEN_AR.chasePreview },
    slug: 'chase-myhome',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'Chase MyHome is a unified homeownership platform connecting mortgage, equity, and market insights in a single app. For most Americans, their home is their largest financial asset, yet they have almost no tools to actively manage it.' },
        { text: 'The central challenge was information architecture. A homeowner\'s financial picture spans mortgage, equity, rates, taxes, insurance, and payments. Surfacing the right signal without overwhelming required deep research into mental models.' },
        { text: 'We introduced a Home Value Dashboard paired with an Equity Builder. Users said: "The first time I actually understood where my money was going."' },
      ],
    },
    scrollyConfig: {
      slug: 'chase-myhome',
      title: 'Chase MyHome App',
      trackHeightVh: 600,
      stage: {
        centerpiece: {
          frame: 'phone',
          width: 260,
          video: ASSETS.video.chaseMyHomeDemo,
          screenAspectRatio: PHONE_SCREEN_AR.chaseMyHomeDemo,
        },
      },
      beats: [
        { id: 'summary',   headline: 'A unified homeownership platform connecting mortgage, equity, and market insights.', body: "Chase MyHome gives customers a complete, active view of their home as a financial asset, tracking value, equity, and payment progress in one place. For most Americans, their home is their largest investment, yet they've had almost no tools to manage it.", range: [0, 0.15] },
        { id: 'challenge', label: 'Challenge', headline: 'Your largest asset, with almost no tools to manage it.', body: 'Chase MyHome is a unified homeownership platform that connects mortgage, equity, and market insights in a single app experience. For most Americans, their home is their largest financial asset, but they have almost no tools to manage it actively. MyHome changes that.', range: [0.15, 0.32] },
        { id: 'approach',  label: 'Approach',  headline: 'How people actually think about home equity over time.', body: 'The central challenge was information architecture. A homeowner\'s financial picture includes mortgage balance, home value, equity, rates, taxes, insurance, and upcoming payments. Surfacing the most relevant signal at any moment, without overwhelming users, required extensive research into how people actually think about their home equity over time.', range: [0.32, 0.50] },
        { id: 'solution',  label: 'Solution',  headline: 'Home Value Dashboard + Equity Builder in one view.', body: 'We introduced a Home Value Dashboard that updates quarterly with real market data, paired with an Equity Builder showing the user exactly how each payment accelerates ownership. In usability testing, users described the equity visualization as "the first time I actually understood where my money was going."', range: [0.50, 0.68] },
        { id: 'results',   label: 'Results',   headline: 'Onboarding redesign increased accounts created by 30% in 2024; mortgage flow drop-off reduced from 18% to 6–10%.', body: 'Led strategic redesign and component migration for new Chase mortgage customer onboarding, contributing to a 30% increase in accounts created in 2024. Also contributed to mortgage application flows that reduced individual drop-off rates from 18% to 6–10%, and helped launch Chase HELOC as a 0-to-1 initiative.', range: [0.68, 0.85] },
        { id: 'tldr',      label: 'TLDR',      headline: 'The quick version.', body: "Chase MyHome connects mortgage, equity, and market insights in a single homeownership platform. I led the strategic redesign of onboarding for new mortgage customers—contributing to a 30% increase in accounts created in 2024—and contributed to application flows that reduced drop-off from 18% to 6–10%. I also helped launch Chase HELOC, created WCAG accessibility documentation, and contributed mobile-first components to the Manhattan Design System.", range: [0.85, 1.0] },
      ],
      cards: [
        { id: 'c1', label: 'Customer interviews', seed: 14, enterAt: 0.14, clusterId: 'discovery', bgColor: '#1e2a20' },
        { id: 'c2', label: 'Mental models', seed: 25, enterAt: 0.17, clusterId: 'discovery', bgColor: '#1a251c' },
        { id: 'c3', label: 'IA mapping', seed: 36, enterAt: 0.20, clusterId: 'research', bgColor: '#1e1e2a' },
        { id: 'c4', label: 'Equity flows', seed: 47, enterAt: 0.23, clusterId: 'research', bgColor: '#1a1a25' },
        { id: 'c5', label: 'Dashboard', seed: 58, enterAt: 0.26, clusterId: 'shipped', bgColor: '#2a1e1e' },
        { id: 'c6', label: 'Equity builder', seed: 69, enterAt: 0.29, clusterId: 'shipped', bgColor: '#251a1a' },
        { id: 'c7', label: '+30% accounts', seed: 80, enterAt: 0.32, clusterId: 'impact', bgColor: '#1a1e2a' },
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
    preview: { frame: 'phone', src: '/assets/agentic-home-lending.png', screenAspectRatio: PHONE_SCREEN_AR.agenticPreview },
    slug: 'agentic-home-lending',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'Agentic Home Lending redesigns the JPMorgan Chase mortgage origination experience, turning a process that took 45 days of back-and-forth into a guided, intelligent flow that adapts to each applicant.' },
        { text: 'The agentic model means the system proactively works on the user\'s behalf: requesting the right documents, flagging issues before underwriting, surfacing alternatives. A knowledgeable guide, not just a form wizard.' },
        { text: 'We introduced a Progress Certainty Score, a real-time confidence indicator. Pilot results: 41% reduction in time-to-close, 28% fewer document re-requests, NPS from 22 to 61.' },
      ],
    },
    scrollyConfig: {
      slug: 'agentic-home-lending',
      title: 'Agentic Home Lending',
      trackHeightVh: 600,
      stage: {
        centerpiece: {
          frame: 'phone',
          width: 260,
          src: '/assets/agentic-home-lending.png',
          screenAspectRatio: PHONE_SCREEN_AR.agenticPreview,
        },
      },
      beats: [
        { id: 'summary',   headline: 'AI-guided mortgage origination that turns a months-long process into days.', body: "Agentic Home Lending redesigns the JPMorgan Chase mortgage experience using AI that proactively works on the applicant's behalf, gathering documents, flagging issues early, and surfacing alternatives before problems arise. The goal was to make a 45-day process feel guided, not grueling.", range: [0, 0.15] },
        { id: 'challenge', label: 'Challenge', headline: '45 days of back-and-forth document exchanges.', body: 'Agentic Home Lending redesigns the JPMorgan Chase mortgage origination experience using agentic AI, turning a process that previously took 45 days of back-and-forth document exchanges into a guided, intelligent flow that adapts to each applicant\'s unique situation.', range: [0.15, 0.32] },
        { id: 'approach',  label: 'Approach',  headline: 'A guide that works on your behalf, not just a form wizard.', body: 'The agentic model means the system proactively works on the user\'s behalf: requesting the right documents at the right time, explaining why each is needed, flagging potential issues before underwriting, and surfacing alternative loan products when the primary option doesn\'t fit. The AI acts as a knowledgeable guide, not just a form wizard.', range: [0.32, 0.50] },
        { id: 'solution',  label: 'Solution',  headline: 'Progress Certainty Score: know exactly where you stand.', body: 'Designing for trust in a high-stakes financial transaction required extreme clarity at every step. We introduced a Progress Certainty Score, a real-time confidence indicator showing applicants exactly where they stood in the process. Pilot results: 41% reduction in time-to-close, 28% reduction in document re-requests, and NPS improvement from 22 to 61.', range: [0.50, 0.68] },
        { id: 'results',   label: 'Results',   headline: 'Pilot: 41% faster close. NPS from 22 to 61.', body: 'Internal pilot results showed 41% reduction in time-to-close, 28% fewer document re-requests, and NPS improvement from 22 to 61. Metrics reflect pilot scope, not full production rollout.', range: [0.68, 0.85] },
        { id: 'tldr',      label: 'TLDR',      headline: 'The quick version.', body: "Mortgage origination at Chase involved 45 days of back-and-forth document exchanges that left applicants confused and uncertain. The agentic model shifted the burden from applicant to system, proactively requesting the right documents, explaining why each was needed, and flagging underwriting issues before they caused delays. The key design challenge was conveying certainty in a high-stakes process, addressed through a Progress Certainty Score showing applicants exactly where they stood at every step. Pilot results: 41% faster time-to-close, 28% fewer document re-requests, and NPS improvement from 22 to 61.", range: [0.85, 1.0] },
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
    tagline: 'Stop making customers guess how to get help.',
    description: 'Redesigned Contact Support experience for Salesforce. Einstein AI routes customers to the right channel instead of asking them to figure it out themselves.',
    year: 2021,
    company: 'Salesforce',
    role: 'Product Designer',
    tags: ['Research', 'Interaction Design', 'AI UX'],
    preview: { frame: 'browser', video: ASSETS.video.salesforceHelp, url: 'help.salesforce.com/s/contactsupport' },
    slug: 'salesforce-help',
    styles: { backgroundColor: '#f4f3f2' },
    caseStudy: {
      blocks: [
        { text: 'Salesforce offered every support channel a customer could want, and that was the problem. Landing on the Contact Support page meant a wall of options with no signal of which fit the issue, which were available on your plan, or which would be fastest. Customers defaulted to opening a case, often the slowest path, even when chat would have resolved them in minutes.' },
        { text: 'Synthesizing internal dashboards, support tickets, interviews, and a 90-plus response survey pointed to one root cause: the page asked customers to make a routing decision they had no information to make. Surfacing paid-plan details mid-support read as upselling, so I reframed the goal: take the decision off the customer and make the system responsible for routing, without ever feeling like a sales funnel.' },
        { text: 'Instead of a menu, the customer describes their issue in their own words. Einstein AI matches the prompt against their history in real time, narrows the problem with topic recommendations, and surfaces the single best channel for their situation. CSAT doubled and case creation volume was reduced, establishing AI-assisted support as a direction Salesforce kept investing in.' },
      ],
    },
    scrollyConfig: {
      slug: 'salesforce-help',
      title: 'Salesforce Help',
      trackHeightVh: 600,
      stage: { centerpiece: { frame: 'browser', width: 400, video: ASSETS.video.salesforceHelp, url: 'help.salesforce.com/s/contactsupport' } },
      beats: [
        { id: 'summary',   headline: 'A redesigned Contact Support experience that uses Einstein AI to route customers to the right channel.', body: 'Salesforce Help replaced a wall of support options with a conversational interface: describing your issue routes you directly to the best channel for your situation. No menus, no guessing, no defaulting to the slowest path.', range: [0, 0.15] },
        { id: 'challenge', label: 'Challenge', headline: 'Stop making customers guess how to get help.', body: 'Salesforce offered every support channel a customer could want, and that was the problem. Landing on the Contact Support page meant a wall of options with no signal of which fit the issue, which were available on your plan, or which would be fastest. Customers defaulted to opening a case, often the slowest path, even when chat would have resolved them in minutes.', range: [0.15, 0.32] },
        { id: 'approach',  label: 'Approach',  headline: 'The page asked customers to make a decision they had no information to make.', body: 'Synthesizing internal dashboards, support tickets, interviews, and a 90-plus response survey pointed to one root cause: the page asked customers to make a routing decision they had no information to make. One constraint shaped everything after: surfacing paid-plan details mid-support read as upselling. I reframed the goal: take the decision off the customer and make the system responsible for routing, without ever feeling like a sales funnel.', range: [0.32, 0.50] },
        { id: 'solution',  label: 'Solution',  headline: 'Describe the issue. Einstein finds the right channel.', body: 'Instead of a menu, the customer describes their issue in their own words. Einstein AI matches the prompt against their history in real time, narrows the problem with topic recommendations, and surfaces the single best channel for their situation. Each step kills a specific failure: the prompt replaces the wall of choices, history-aware routing pulls volume off case submission, and personalization surfaces faster paths that were invisible before.', range: [0.50, 0.68] },
        { id: 'outcome',   label: 'Outcome',   headline: 'Doubled CSAT and reduced case creation volume.', body: 'AI Contact Support doubled CSAT and reduced case creation volume by routing customers to the right channel instead of defaulting to the slowest path. The work established AI-assisted support as a sustained direction for Salesforce.', range: [0.68, 0.85] },
        { id: 'tldr',      label: 'TLDR',      headline: 'The quick version.', body: "Salesforce's Contact Support page offered every channel a customer could want, and that was the problem. Research across dashboards, tickets, interviews, and a 90-plus response survey pointed to one root cause: customers were asked to make a routing decision they had no information to make. Einstein AI was trained to match issue descriptions against customer history and surface the single best channel in real time. CSAT doubled, case creation volume was reduced, and the work helped establish AI-assisted support as a sustained direction for Salesforce.", range: [0.85, 1.0] },
      ],
      cards: [
        { id: 'c1', label: '90+ survey', seed: 16, enterAt: 0.14, clusterId: 'discovery', bgColor: '#1e2a1e' },
        { id: 'c2', label: 'Support tickets', seed: 27, enterAt: 0.17, clusterId: 'discovery', bgColor: '#1a251a' },
        { id: 'c3', label: 'Routing paths', seed: 38, enterAt: 0.20, clusterId: 'research', bgColor: '#1e1e2a' },
        { id: 'c4', label: 'Upsell constraint', seed: 49, enterAt: 0.23, clusterId: 'research', bgColor: '#1a1a25' },
        { id: 'c5', label: 'Einstein routing', seed: 60, enterAt: 0.26, clusterId: 'shipped', bgColor: '#2a201e' },
        { id: 'c6', label: 'Channel selector', seed: 71, enterAt: 0.29, clusterId: 'shipped', bgColor: '#251c1a' },
        { id: 'c7', label: '2× CSAT', seed: 82, enterAt: 0.32, clusterId: 'impact', bgColor: '#1a1e2a' },
        { id: 'c8', label: 'Fewer cases', seed: 93, enterAt: 0.15, bgColor: '#222222' },
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

/** Featured card order: Chase projects first, then Memento, then the rest. */
export const PROJECT_ORDER = [
  'casey-ai',
  'chase-myhome',
  'agentic-home-lending',
  'memento-ai',
  'autods-m-ai',
  'salesforce-help',
] as const;

export function sortProjectsByFeaturedOrder(items: Project[]): Project[] {
  const rank = new Map<string, number>(
    PROJECT_ORDER.map((slug, index) => [slug, index]),
  );
  return [...items].sort(
    (a, b) =>
      (rank.get(a.slug) ?? PROJECT_ORDER.length) -
      (rank.get(b.slug) ?? PROJECT_ORDER.length),
  );
}
