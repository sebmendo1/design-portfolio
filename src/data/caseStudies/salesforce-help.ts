import { ASSETS } from '@/data/assets';
import {
  DEFAULT_BROWSER_SCREEN_AR,
  SALESFORCE_HELP_CASES_SCREEN_AR,
  SALESFORCE_HELP_HOME_SCREEN_AR,
} from '@/components/BrowserStencil/browser-aspect-ratios';
import type { CaseStudy } from './types';

export const salesforceHelp: CaseStudy = {
  slug: 'salesforce-help',
  section: 'salesforce',
  title: 'Describe your issue, and Einstein picks the support channel',
  summary: 'AI Contact Support for Salesforce: customers describe the problem once and get one recommended channel.',
  company: 'Salesforce',
  year: '2022',
  meta: {
    role: 'Product Designer, Contact Support',
    // TODO(seb): verify team makeup.
    team: 'Product, engineering, and the Einstein AI team',
    timeline: 'Shipped June 2022',
    platform: 'Web, help.salesforce.com',
    status: 'Shipped',
  },
  hero: {
    media: [
      {
        type: 'browser',
        video: ASSETS.video.salesforceHelp,
        url: 'help.salesforce.com/s/contactsupport',
        screenAspectRatio: DEFAULT_BROWSER_SCREEN_AR,
        alt: 'Salesforce AI Contact Support flow',
      },
    ],
    shape: 'wide',
    caption: 'The customer describes the problem in plain words. Einstein suggests topics to narrow it, then recommends one channel.',
  },
  tldr: {
    situation: 'Salesforce offered every support channel, and most customers opened a case, often the slowest option.',
    task: 'I needed to send each customer to the channel that fit their issue.',
    action: 'I designed AI Contact Support, where Einstein matches the described issue against the customer’s history and recommends one channel.',
    // TODO(seb): add the CSAT baseline and measurement window.
    result: 'CSAT doubled and case volume dropped.',
    keyResult: {
      value: '2×',
      label: 'CSAT after launch, with fewer cases created',
      // TODO(seb): add the CSAT baseline and measurement window.
      context: 'AI Contact Support',
      confidence: 'measured',
    },
  },
  context: {
    heading: 'The page asked customers to make a decision they had no information to make.',
    body: [
      'Dashboards, support tickets, interviews, and a survey with 90+ responses pointed to one cause. Customers could not see which channels their plan included or which would be fastest.',
      'Showing paid-plan details in the middle of a support request read as upselling, which ruled out the obvious fix.',
    ],
    constraints: ['Enterprise customers on different support plans', 'No upselling in the support flow', 'Einstein as the routing engine'],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'I made the system responsible for choosing the channel.',
    items: [
      {
        title: 'Ask for a description before showing channels',
        body: 'The first thing a customer sees is a box to describe the problem. Channel options come after the system has matched the issue.',
        alternative: 'A cleaner, better-labeled grid of every support channel.',
        tradeoff: 'Customers who already knew which channel they wanted take one extra step.',
      },
      {
        title: 'Recommend one channel',
        body: 'Einstein matches the description against the customer’s history, suggests topics to narrow it, then shows the one channel most likely to resolve it.',
        alternative: 'A ranked list of every channel with estimated wait times.',
        tradeoff: 'Customers see fewer choices, and routing is only as good as the model’s match.',
        figure: {
          media: [
            {
              type: 'browser',
              src: '/assets/salesforce-help-home.png',
              url: 'help.salesforce.com',
              screenAspectRatio: SALESFORCE_HELP_HOME_SCREEN_AR,
              alt: 'Salesforce Help home',
            },
          ],
          shape: 'wide',
          caption: 'Help home, where customers start. From here, Contact Support recommends one channel instead of listing them all.',
        },
      },
      {
        title: 'Keep plan upgrades out of support',
        body: 'Routing only shows channels the customer’s plan includes, so asking for help never turns into a sales pitch.',
        // TODO(seb): verify that an in-flow premium support upsell was proposed.
        alternative: 'Show premium channels with an upgrade prompt.',
        tradeoff: 'The business gave up an upsell spot on one of its highest-traffic pages.',
        figure: {
          media: [
            {
              type: 'browser',
              src: '/assets/salesforce-help-cases.png',
              url: 'help.salesforce.com',
              screenAspectRatio: SALESFORCE_HELP_CASES_SCREEN_AR,
              alt: 'Salesforce Help cases list',
            },
          ],
          shape: 'wide',
          caption: 'The case list. Customers still open cases when a case is the right channel, but fewer end up here by default.',
        },
      },
    ],
  },
  behavior: {
    heading: 'When Einstein is unsure, it asks before it routes.',
    states: [
      { state: 'Describe', behavior: 'The customer types the issue in plain language.' },
      { state: 'Match', behavior: 'Einstein compares it with the customer’s history.' },
      { state: 'Low confidence', behavior: 'Suggests topics to narrow the problem.' },
      { state: 'Recommend', behavior: 'Shows the one channel most likely to resolve it.' },
      // TODO(seb): verify the no-match fallback.
      { state: 'No match', behavior: 'Falls back to opening a case with the description attached.' },
    ],
  },
  result: {
    heading: 'CSAT doubled, and fewer customers needed to open a case.',
    metrics: [
      { value: '2×', label: 'CSAT', context: 'AI Contact Support', confidence: 'measured' },
      { value: 'Fewer', label: 'Cases created', context: 'after launch', confidence: 'measured' },
    ],
    body: ['Salesforce kept investing in AI-assisted support after this launch.'],
  },
  reflection: {
    heading: 'I would measure routing accuracy from the first day.',
    body: [
      // TODO(seb): verify this reflection is yours.
      'CSAT showed customers were happier. Tracking how often the recommended channel solved the issue would have shown why.',
    ],
  },
};
