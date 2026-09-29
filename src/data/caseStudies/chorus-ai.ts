import { ASSETS } from '@/data/assets';
import { CHORUS_DEMO_SCREEN_AR } from '@/components/BrowserStencil/browser-aspect-ratios';
import type { CaseStudy } from './types';

export const chorusAi: CaseStudy = {
  slug: 'chorus-ai',
  section: 'chorus-ai',
  title: 'Chorus’s design system, rebuilt around the product’s features',
  summary: 'Chorus.ai’s component library, rebuilt with variants, a consistent grid, and one page per feature.',
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
    caption: 'Call review in Chorus. Every panel on this screen uses the rebuilt components, grid, and tokens.',
  },
  lede: [
    'Chorus’s design system stopped at atoms and molecules, which caused constant back-and-forth between design and engineering.',
    'I scoped a rebuild with PMs that could land without pausing feature work, then rebuilt the library with variants, tokens, and a consistent grid.',
    'Teams were moving feature work onto it when ZoomInfo acquired Chorus in July 2021.',
  ],
  tldr: {
    situation: 'Chorus’s design system stopped at atoms and molecules, which caused constant back-and-forth between design and engineering.',
    task: 'I scoped a rebuild with PMs that could land without pausing feature work.',
    action: 'I rebuilt the library with variants, tokens, and a consistent grid, organized by product feature.',
    result: 'Teams were moving feature work onto it when ZoomInfo acquired Chorus in July 2021.',
  },
  problem: {
    heading: 'The library had buttons, but the product was built from panels.',
    body: [
      'There were no templates, cards, or complex components. The grid was applied inconsistently, and nothing used Auto Layout or variants.',
      // TODO(seb): verify these constraints (no feature freeze, small design team).
      'Three limits shaped the rebuild: first, no feature freeze; second, a small design team; and third, a fast-moving AI product.',
    ],
    constraints: ['No feature freeze', 'Small design team', 'Fast-moving AI product'],
  },
  whyItMatters: {
    heading: 'Design and engineering argued over CSS values every sprint.',
    body: [
      'The gaps caused constant back-and-forth over exact values, visible inconsistency across the product, and hard sprint planning for PMs. The product was changing fast, so the rebuild had to land without pausing feature work.',
    ],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'I agreed the scope with PMs before changing the library.',
    items: [
      {
        title: 'Agree on must-haves first',
        body: 'With PMs, I split the work into four jobs: modernize components, split large molecules by feature, build a grid and templates, and redesign the right sidebar.',
        alternative: 'Rewrite the whole library in one pass.',
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
          caption: 'The audit showed plenty of atoms and almost nothing a feature team could use as-is.',
        },
      },
      {
        title: 'Organize the library by product feature',
        body: 'Recordings, Inbox, Meetings, Deals, Coaching, Analytics, and Playlists each got a page, so designers and engineers found components under the feature they worked on.',
        alternative: 'A strict atoms → molecules → organisms hierarchy only.',
        tradeoff: 'Some components appear under more than one feature, so each needs a clear owner.',
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
          caption: 'One Figma page per product feature. Atomic Design still sits underneath, but people browse by the feature they build.',
        },
      },
      {
        title: 'Redesign the most reused panel first',
        body: 'The right sidebar appears on every call review. I rebuilt it in place across Comments, Snippets, and Scorecards, so every team picked up the new version at once.',
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
          caption: 'Dashboards and the sidebar use the same grid, so new features line up without custom CSS.',
        },
      },
    ],
  },
  impact: {
    heading: 'Design and engineering shared one set of components going into the acquisition.',
    metrics: [],
    body: [
      // TODO(seb): add any adoption or speed numbers you can defend (components shipped, teams using it).
      'Design and engineering worked from the same components, grid, and tokens. ZoomInfo announced its acquisition of Chorus on July 13, 2021, while teams were moving feature work onto the system.',
    ],
  },
  reflection: {
    heading: 'I would have tracked how many screens used the system.',
    body: [
      // TODO(seb): verify this reflection is yours.
      'I tracked which components existed. Counting the product screens built from them would have shown the impact much sooner.',
    ],
  },
};
