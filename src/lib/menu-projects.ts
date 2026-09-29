import { CASE_STUDIES } from '@/data/caseStudies';
import { findHomeSection, type HomeSectionLogo } from '@/lib/home-sections';

export type MenuProject = {
  slug: string;
  href: string;
  title: string;
  company: string;
  logo?: HomeSectionLogo;
};

/** Short labels for the header menu — claim titles are too long for a dense list. */
const MENU_TITLES: Record<string, string> = {
  'memento-ai': 'Memento AI',
  'casey-ai': 'Casey AI',
  'agentic-home-lending': 'Agentic Home Lending',
  'chase-myhome': 'Chase MyHome',
  'salesforce-help': 'Salesforce Help',
  'writer-ai': 'WRITER',
  'chorus-ai': 'Chorus AI',
  'seb-sans': 'Seb Sans',
};

export type MenuProjectGroup = {
  company: string;
  items: MenuProject[];
};

/** Case studies in homepage feed order, grouped by company for the header menu. */
export function getMenuProjectGroups(): MenuProjectGroup[] {
  const groups: MenuProjectGroup[] = [];

  for (const study of CASE_STUDIES) {
    const item: MenuProject = {
      slug: study.slug,
      href: `/work/${study.slug}`,
      title: MENU_TITLES[study.slug] ?? study.title,
      company: study.company,
      logo: findHomeSection(study.section)?.logo,
    };
    const last = groups[groups.length - 1];
    if (last && last.company === study.company) {
      last.items.push(item);
    } else {
      groups.push({ company: study.company, items: [item] });
    }
  }

  return groups;
}
