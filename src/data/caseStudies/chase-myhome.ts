import { ASSETS } from '@/data/assets';
import {
  CHASE_MYHOME_CALCULATORS_SCREEN_AR,
  CHASE_MYHOME_LANDING_SCREEN_AR,
} from '@/components/BrowserStencil/browser-aspect-ratios';
import type { CaseStudy } from './types';

export const chaseMyHome: CaseStudy = {
  slug: 'chase-myhome',
  section: 'chase-home-lending',
  title: 'Mortgage onboarding redesign that helped lift new accounts 30%',
  summary: 'Chase MyHome onboarding, application flows, and a home view that leads with equity.',
  company: 'JPMorgan Chase',
  year: '2023–2025',
  meta: {
    role: 'Senior Product Designer, Chase MyHome',
    team: 'Engineering, product, legal, ADA, and strategy partners',
    timeline: 'Mar 2023 – Jul 2025',
    platform: 'iOS, Android, and chase.com',
    status: 'Shipped',
  },
  hero: {
    media: [{ type: 'phone', video: ASSETS.video.chaseMyHomeDemo, alt: 'Chase MyHome app walkthrough' }],
    caption: 'The MyHome home view shows home value, equity, and the next payment together.',
  },
  tldr: {
    situation: 'New mortgage customers were dropping out of Chase MyHome onboarding and application flows.',
    task: 'I led the onboarding redesign for new mortgage customers.',
    action: 'I rebuilt onboarding on the Manhattan Design System and contributed to the application flows.',
    result: 'Accounts created rose 30% in 2024, and drop-off fell from 18% to 6–10%.',
    keyResult: {
      value: '+30%',
      label: 'accounts created in 2024',
      context: 'new mortgage customer onboarding',
      confidence: 'measured',
    },
  },
  problem: {
    heading: 'New mortgage customers were dropping out of onboarding and applications.',
    body: [
      'Drop-off in the mortgage application flows was 18%. Customers who got through faced balance, value, equity, rate, taxes, insurance, and payments, with few ways to make sense of them.',
    ],
    constraints: ['Regulated disclosures', 'WCAG accessibility', 'Shared Manhattan Design System'],
  },
  whyItMatters: {
    heading: 'Onboarding decides whether a new mortgage customer uses MyHome at all.',
    body: [
      'Showing everything at once overwhelms people, and showing too little hides what they care about. Every screen also had to pass legal and ADA review.',
    ],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'I chose shared components and early accessibility specs, even though both were slower.',
    items: [
      {
        title: 'Rebuild onboarding on shared components',
        body: 'I moved onboarding to the Manhattan Design System and added mobile-first components where it had gaps, so the redesign stayed consistent with the rest of Chase.',
        // TODO(seb): verify the alternative and whether custom screens were proposed.
        alternative: 'A faster redesign with one-off screens.',
        tradeoff: 'A longer first release while components went through design system review.',
      },
      {
        title: 'Lead the home view with equity',
        // TODO(seb): verify the research insight wording (own vs owe).
        body: 'In research, people described their home by what they owned in it more than by what they owed. The home view leads with value and equity, and shows how each payment adds to it.',
        // TODO(seb): verify the balance-first alternative.
        alternative: 'Lead with the loan balance and next payment, like a typical servicing app.',
        tradeoff: 'Payment details sit one level deeper for people who only come to pay.',
        figure: {
          media: [{ type: 'phone', src: '/assets/chase-myhome.png', alt: 'Chase MyHome home value and equity view' }],
          caption: 'In testing, a user said the equity view was “the first time I actually understood where my money was going.”',
        },
      },
      {
        title: 'Write accessibility specs before build',
        body: 'I wrote WCAG documentation with each flow, so engineering and ADA partners reviewed behavior before it was built.',
        alternative: 'Accessibility review at the end of each release.',
        tradeoff: 'More documentation up front for every screen.',
        figure: {
          media: [
            {
              type: 'browser',
              src: '/assets/chase-myhome-calculators.png',
              url: 'chase.com',
              screenAspectRatio: CHASE_MYHOME_CALCULATORS_SCREEN_AR,
              alt: 'Chase MyHome mortgage calculators',
            },
          ],
          shape: 'wide',
          caption: 'People can run the mortgage math on chase.com before applying. The calculators use the same components as the app.',
        },
      },
    ],
  },
  howItWorks: {
    heading: 'The chase.com landing page leads into the same flows as the app.',
    figures: [
      {
        media: [
          {
            type: 'browser',
            src: '/assets/chase-myhome-landing.png',
            url: 'chase.com',
            screenAspectRatio: CHASE_MYHOME_LANDING_SCREEN_AR,
            alt: 'Chase MyHome landing page',
          },
        ],
        shape: 'wide',
        caption: 'The landing page links to rates, tools, and the application, then hands customers to MyHome after closing.',
      },
    ],
  },
  impact: {
    heading: 'More accounts, less drop-off, and a HELOC launch.',
    metrics: [
      { value: '+30%', label: 'Accounts created', context: '2024, onboarding redesign', confidence: 'measured' },
      { value: '18% → 6–10%', label: 'Drop-off per step', context: 'application flows, contributed', confidence: 'measured' },
      { value: '0 → 1', label: 'Chase HELOC launched', context: 'March 2024, contributed', confidence: 'measured' },
    ],
    body: [
      // TODO(seb): verify the components are still in the Manhattan Design System.
      'The mobile-first components I contributed are now part of the Manhattan Design System, available to other Chase teams.',
    ],
  },
  reflection: {
    heading: 'At Chase I started bringing legal and ADA in at the start of each flow.',
    body: [
      // TODO(seb): verify this reflection is yours.
      'Legal, ADA, and strategy worked with me as design partners instead of reviewing at the end. I kept working that way on Casey, Chase’s first customer-facing AI agent.',
    ],
  },
};
