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
  summary: 'Chase MyHome onboarding, application flows, and a home view built around equity.',
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
    caption: 'MyHome puts value, equity, and the next payment in one view, instead of five separate screens.',
  },
  tldr: {
    body: 'New mortgage customers were dropping out of onboarding and application flows. I led the strategic redesign of Chase MyHome onboarding and its migration to shared components, and contributed to the application flows. Accounts created rose 30% in 2024, and drop-off fell from 18% to 6–10%.',
    keyResult: {
      value: '+30%',
      label: 'accounts created in 2024',
      context: 'new mortgage customer onboarding',
      confidence: 'measured',
    },
  },
  context: {
    heading: 'A home is most people’s largest asset, and they had almost no tools to manage it.',
    body: [
      'A homeowner’s picture spans balance, value, equity, rates, taxes, insurance, and payments. Showing all of it overwhelms; showing too little hides what matters.',
      'Every screen also had to clear legal and ADA review inside one of the largest banks in the US.',
    ],
    constraints: ['Regulated disclosures', 'WCAG accessibility', 'Shared Manhattan Design System'],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'I traded speed for a foundation other teams could reuse.',
    items: [
      {
        title: 'Rebuild onboarding on shared components',
        body: 'I migrated onboarding to the Manhattan Design System and added mobile-first components where it had gaps, so the redesign would not drift from the rest of Chase.',
        // TODO(seb): verify the alternative and whether custom screens were proposed.
        alternative: 'A faster redesign with one-off screens.',
        tradeoff: 'A longer first release while components went through design system review.',
      },
      {
        title: 'Lead the home view with equity',
        // TODO(seb): verify the research insight wording (own vs owe).
        body: 'Research into how people think about their home showed they track what they own, not what they owe. The dashboard leads with value and equity, and shows how each payment builds it.',
        // TODO(seb): verify the balance-first alternative.
        alternative: 'Lead with the loan balance and next payment, like a typical servicing app.',
        tradeoff: 'Payment details sit one level deeper for people who only come to pay.',
        figure: {
          media: [{ type: 'phone', src: '/assets/chase-myhome.png', alt: 'Chase MyHome home value and equity view' }],
          caption: 'In testing, one user called the equity view “the first time I actually understood where my money was going.”',
        },
      },
      {
        title: 'Ship accessibility as a spec, not an audit',
        body: 'I wrote WCAG documentation alongside each flow so engineering and ADA partners reviewed behavior before build, not after.',
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
          caption: 'Public calculators let people run the mortgage math before they apply, using the same components as the app.',
        },
      },
    ],
  },
  shipped: {
    heading: 'One front door, from chase.com into the app.',
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
        caption: 'The landing page routes people into rates, tools, and applying, and hands off to MyHome after closing.',
      },
    ],
  },
  result: {
    heading: 'More accounts, less drop-off, and a new product.',
    metrics: [
      { value: '+30%', label: 'Accounts created', context: '2024, onboarding redesign', confidence: 'measured' },
      { value: '18% → 6–10%', label: 'Drop-off per step', context: 'application flows, contributed', confidence: 'measured' },
      { value: '0 → 1', label: 'Chase HELOC launched', context: 'March 2024, contributed', confidence: 'measured' },
    ],
    body: [
      // TODO(seb): verify the components are still in the Manhattan Design System.
      'The mobile-first components I contributed now live in the Manhattan Design System for other Chase teams.',
    ],
  },
  reflection: {
    heading: 'This is where I learned to design inside the rules.',
    body: [
      // TODO(seb): verify this reflection is yours.
      'Legal, ADA, and strategy were design partners, not reviewers. I brought that habit to Casey, Chase’s first AI agent.',
    ],
  },
};
