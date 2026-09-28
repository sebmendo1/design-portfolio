import { ASSETS } from '@/data/assets';
import { CHORUS_DEMO_SCREEN_AR } from '@/components/BrowserStencil/browser-aspect-ratios';
import type { CaseStudy } from './types';

export const chorusAi: CaseStudy = {
  slug: 'chorus-ai',
  section: 'chorus-ai',
  title: 'A design system rebuilt around features, so teams stopped arguing CSS',
  summary: 'Chorus.ai’s component library, rebuilt with variants, a real grid, and feature pages.',
  company: 'Chorus.ai',
  year: '2020–2021',
  meta: {
    role: 'Product Designer, design systems',
    team: 'Product managers, front-end engineering, and product design',
    timeline: 'Jun 2020 – Jun 2021',
    platform: 'Web app, Figma library',
    status: 'Shipped',
  },
  hero: {
    media: [
      {
        type: 'browser',
        video: ASSETS.video.chorusDemo,
        url: 'chorus.ai',
        screenAspectRatio: CHORUS_DEMO_SCREEN_AR,
        alt: 'Chorus.ai conversation intelligence product',
      },
    ],
    shape: 'wide',
    caption: 'Call review in Chorus. Every panel here now comes from the same components, grid, and tokens.',
  },
  tldr: {
    body: 'Chorus’s design system stopped at atoms and molecules, so design and engineering argued over CSS every sprint. I scoped the rebuild with PMs, then rebuilt the library with variants, tokens, and a real grid, organized by product feature. It was standardizing feature work when ZoomInfo acquired Chorus in July 2021.',
  },
  context: {
    heading: 'The library covered buttons, but the product was made of panels.',
    body: [
      'There were no templates, cards, or complex components. The grid was used inconsistently, and nothing used Auto Layout or variants.',
      'The product was changing fast, so the rebuild had to land without pausing feature work.',
    ],
    // TODO(seb): verify these constraints (no feature freeze, small design team).
    constraints: ['No feature freeze', 'Small design team', 'Fast-moving AI product'],
  },
  decisions: {
    heading: 'I scoped four jobs with PMs before touching Figma.',
    items: [
      {
        title: 'Agree on must-haves before rebuilding anything',
        body: 'With PMs I split the work into four jobs: modernize components, split large molecules by feature, build a grid and templates, and redesign the right sidebar.',
        alternative: 'A full rewrite of the library in one pass.',
        tradeoff: 'Some nice-to-have components waited for later cycles.',
        figure: {
          media: [
            {
              type: 'image',
              src: '/assets/chorus-ai-ds-audit.png',
              width: 1688,
              height: 1140,
              alt: 'Audit of the existing Chorus component library',
            },
          ],
          shape: 'wide',
          caption: 'The audit made the gap obvious: plenty of atoms, almost nothing a feature team could use as-is.',
        },
      },
      {
        title: 'Organize the library by feature, not by atom',
        body: 'Recordings, Inbox, Meetings, Deals, Coaching, Analytics, and Playlists each got a page, so designers and engineers found components where they worked.',
        alternative: 'A strict atoms → molecules → organisms hierarchy only.',
        tradeoff: 'Some components appear under more than one feature and need careful ownership.',
        figure: {
          media: [
            {
              type: 'image',
              src: '/assets/chorus-ai-features.png',
              width: 3200,
              height: 1800,
              alt: 'Chorus design system organized by product feature',
            },
          ],
          shape: 'wide',
          caption: 'One Figma page per feature. Atomic Design still underpins it, but people navigate by the product they build.',
        },
      },
      {
        title: 'Redesign the most reused surface first',
        body: 'The right sidebar appears on every call review. I rebuilt it in context across Comments, Snippets, and Scorecards so every team inherited it at once.',
        alternative: 'Start with the simplest components to show quick progress.',
        tradeoff: 'The first release took longer and touched more teams.',
        figure: {
          media: [
            {
              type: 'image',
              src: '/assets/chorus-ai-dashboard.png',
              width: 1550,
              height: 1022,
              alt: 'Chorus dashboard built from the rebuilt system',
            },
          ],
          shape: 'wide',
          caption: 'Dashboards and the sidebar share one grid, so new features line up without a CSS debate.',
        },
      },
    ],
  },
  result: {
    heading: 'One source of truth for a product in the middle of an acquisition.',
    metrics: [],
    body: [
      // TODO(seb): add any adoption or speed numbers you can defend (components shipped, teams using it).
      'Design and engineering worked from the same components, grid, and tokens. ZoomInfo announced its acquisition of Chorus on July 13, 2021, while the system was standardizing feature delivery.',
    ],
  },
  reflection: {
    heading: 'I would measure adoption, not just coverage.',
    body: [
      // TODO(seb): verify this reflection is yours.
      'I tracked which components existed. Tracking how many product screens used them would have shown the impact much sooner.',
    ],
  },
};
