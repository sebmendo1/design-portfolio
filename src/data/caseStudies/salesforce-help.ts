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
  summary: 'AI Contact Support for Salesforce customers: one prompt replaces a wall of support options.',
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
    caption: 'The customer types the problem in plain words. Einstein narrows it and recommends one channel.',
  },
  tldr: {
    body: 'Salesforce offered every support channel, and customers could not tell which one fit. Most opened a case, often the slowest path. I designed AI Contact Support: customers describe the issue, and Einstein matches it against their history to recommend the best channel. CSAT doubled and case volume dropped.',
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
      'Dashboards, support tickets, interviews, and a survey with 90+ responses all pointed to the same root cause. Customers could not see which channels their plan included or which would be fastest.',
      'One constraint shaped everything: showing paid-plan details in the middle of a support request read as upselling.',
    ],
    constraints: ['Enterprise customers with different support plans', 'No upsell in the support flow', 'Einstein as the routing engine'],
  },
  // TODO(seb): verify every decision's "Instead of" and trade-off; they are inferred from existing copy, not supplied.
  decisions: {
    heading: 'I moved the routing decision from the customer to the system.',
    items: [
      {
        title: 'Start with a prompt, not a menu',
        body: 'The first thing a customer sees is a box to describe the problem in their own words. The channel choice comes after the system understands the issue.',
        alternative: 'A cleaner, better-labeled grid of every support channel.',
        tradeoff: 'Customers who already knew what they wanted take one extra step.',
      },
      {
        title: 'Recommend one best channel',
        body: 'Einstein matches the description against the customer’s history, suggests topics to narrow it, then surfaces the single channel most likely to resolve it.',
        alternative: 'A ranked list of every channel with estimated wait times.',
        tradeoff: 'Less visible choice, and routing quality depends on the model getting the match right.',
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
          caption: 'Help home orients people before they ask. Contact Support then routes them to one answer instead of six options.',
        },
      },
      {
        title: 'Keep plan upgrades out of support',
        body: 'Routing never shows a channel the customer cannot use, so help never reads as a sales pitch.',
        // TODO(seb): verify that an in-flow premium support upsell was proposed.
        alternative: 'Show premium channels with an upgrade prompt.',
        tradeoff: 'The business gave up an upsell surface in one of its highest-traffic pages.',
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
          caption: 'When a case is the right call, it is tracked here. Fewer customers land on it by default.',
        },
      },
    ],
  },
  behavior: {
    heading: 'When Einstein is unsure, it asks before it routes.',
    states: [
      { state: 'Describe', behavior: 'Customer types the issue in plain language.' },
      { state: 'Match', behavior: 'Einstein compares it with the customer’s history.' },
      { state: 'Low confidence', behavior: 'Suggests topics to narrow the problem.' },
      { state: 'Recommend', behavior: 'Surfaces the one channel most likely to resolve it.' },
      // TODO(seb): verify the no-match fallback.
      { state: 'No match', behavior: 'Falls back to opening a case with the description attached.' },
    ],
  },
  result: {
    heading: 'Customers got to the right help faster, and fewer needed a case.',
    metrics: [
      { value: '2×', label: 'CSAT', context: 'AI Contact Support', confidence: 'measured' },
      { value: 'Fewer', label: 'Cases created', context: 'after launch', confidence: 'measured' },
    ],
    body: [
      'AI-assisted support became a direction Salesforce kept investing in, and this work was the baseline for later support agents.',
    ],
  },
  reflection: {
    heading: 'I would instrument routing accuracy from day one.',
    body: [
      // TODO(seb): verify this reflection is yours.
      'CSAT told us customers were happier. A measure of how often the recommended channel resolved the issue would have told us why.',
    ],
  },
};
