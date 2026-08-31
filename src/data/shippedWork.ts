export type ShippedWorkEntry = {
  id: string;
  title: string;
  affiliation: string;
  /** ISO YYYY-MM for sorting (newest first). */
  sortDate: string;
  dateLabel: string;
  projectSlug?: string;
  pending?: boolean;
};

/** Things shipped in reverse chronological order — work and side projects. */
export const SHIPPED_WORK: ShippedWorkEntry[] = [
  {
    id: 'memento-ai',
    title: 'Memento AI',
    affiliation: 'Side project',
    sortDate: '2026-06',
    dateLabel: 'June 2026',
    projectSlug: 'memento-ai',
  },
  {
    id: 'agentic-home-lending',
    title: 'Agentic Home Lending',
    affiliation: 'Chase',
    sortDate: '2026-07',
    dateLabel: 'Pending',
    projectSlug: 'agentic-home-lending',
    pending: true,
  },
  {
    id: 'conversational-rcs',
    title: 'Conversational RCS',
    affiliation: 'Chase',
    sortDate: '2026-05',
    dateLabel: 'May 2026',
    projectSlug: 'casey-ai',
  },
  {
    id: 'home-lending-calculators',
    title: 'Home Lending Calculators',
    affiliation: 'Chase',
    sortDate: '2025-10',
    dateLabel: 'October 2025',
  },
  {
    id: 'cmh-landing',
    title: 'Chase MyHome Landing Page',
    affiliation: 'Chase',
    sortDate: '2025-09',
    dateLabel: '2025',
    projectSlug: 'chase-myhome',
  },
  {
    id: 'conversational-voice',
    title: 'Conversational AI (Voice)',
    affiliation: 'Chase',
    sortDate: '2025-07',
    dateLabel: 'July 2025',
    projectSlug: 'casey-ai',
  },
  {
    id: 'chase-onboarding',
    title: 'Chase MyHome Onboarding',
    affiliation: 'Chase',
    sortDate: '2024-06',
    dateLabel: 'June 2024',
    projectSlug: 'chase-myhome',
  },
  {
    id: 'chase-heloc',
    title: 'Chase HELOC',
    affiliation: 'Chase',
    sortDate: '2024-03',
    dateLabel: 'March 2024',
    projectSlug: 'chase-myhome',
  },
  {
    id: 'manhattan-ds',
    title: 'Manhattan Design System Components',
    affiliation: 'Chase',
    sortDate: '2024-01',
    dateLabel: '2024',
  },
  {
    id: 'chase-mortgage-flows',
    title: 'Mortgage Application Flows',
    affiliation: 'Chase',
    sortDate: '2023-08',
    dateLabel: 'August 2023',
    projectSlug: 'chase-myhome',
  },
  {
    id: 'salesforce-help',
    title: 'AI Contact Support',
    affiliation: 'Salesforce',
    sortDate: '2022-06',
    dateLabel: 'June 2022',
    projectSlug: 'salesforce-help',
  },
  {
    id: 'writer-rewrite',
    title: 'ReWrite',
    affiliation: 'Writer',
    sortDate: '2021-04',
    dateLabel: 'April 2021',
    projectSlug: 'writer-ai',
  },
  {
    id: 'writer-snippets',
    title: 'Snippets',
    affiliation: 'Writer',
    sortDate: '2021-03',
    dateLabel: 'March 2021',
  },
  {
    id: 'writer-figma-plugin',
    title: 'Content Approvals (Figma Plugin)',
    affiliation: 'Writer',
    sortDate: '2021-02',
    dateLabel: 'February 2021',
  },
  {
    id: 'chorus-ds',
    title: 'Chorus Design System',
    affiliation: 'Chorus AI',
    sortDate: '2020-09',
    dateLabel: 'September 2020',
    projectSlug: 'chorus-ai',
  },
];
