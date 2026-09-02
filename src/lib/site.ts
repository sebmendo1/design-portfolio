/** Canonical site URL for metadata, sitemap, and OG. */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export const SITE_NAME = 'Sebastian Mendo';
export const SITE_TITLE = 'Sebastian Mendo | Senior Product Designer';
export const SITE_DESCRIPTION =
  'Portfolio of Sebastian Mendo, Senior Product Designer at JPMorgan Chase. AI-first product design for banking, voice, and enterprise software.';

export const SITE_CONTACT_EMAIL = 'contact@sebastianmendo.design';

/** Published work location — no street number is claimed. */
export const SITE_ADDRESS = {
  addressLocality: 'Plano',
  addressRegion: 'TX',
  addressCountry: 'US',
} as const;

/** Profile URLs for JSON-LD sameAs and external identity links. */
export const SITE_LINKEDIN_URL = 'https://www.linkedin.com/in/sebastianmendo/';
export const SITE_GITHUB_URL = 'https://github.com/sebmendo1';
export const SITE_X_URL = 'https://x.com/Seb_Mendo_1';

export const SITE_SOCIAL_NAV = [
  { label: 'linkedin', href: SITE_LINKEDIN_URL },
  { label: 'github', href: SITE_GITHUB_URL },
  { label: 'x', href: SITE_X_URL },
] as const;

export const SITE_SOCIAL_LINKS: string[] = SITE_SOCIAL_NAV.map((link) => link.href);

export const WORK_PAGE_BIO_LEAD_PREFIX =
  'Sebastian is a Senior Product Designer building agentic financial experiences at ';

export const WORK_PAGE_BIO_CURRENT = {
  label: 'Chase',
  href: 'https://www.chase.com',
} as const;

export const WORK_PAGE_BIO_PREVIOUS_INTRO = '. Previously at ';

export const WORK_PAGE_BIO_LINKS = [
  {
    label: 'Salesforce',
    href: 'https://www.salesforce.com',
  },
  {
    label: 'Writer AI',
    href: 'https://writer.com',
  },
  {
    label: 'Chorus AI',
    href: 'https://www.chorus.ai',
  },
] as const;

const WORK_PAGE_BIO_PREVIOUS_LABELS = WORK_PAGE_BIO_LINKS.map((link) => link.label);
const WORK_PAGE_BIO_PREVIOUS_LIST =
  WORK_PAGE_BIO_PREVIOUS_LABELS.length <= 1
    ? (WORK_PAGE_BIO_PREVIOUS_LABELS[0] ?? '')
    : `${WORK_PAGE_BIO_PREVIOUS_LABELS.slice(0, -1).join(', ')} and ${WORK_PAGE_BIO_PREVIOUS_LABELS.at(-1)}`;

export const WORK_PAGE_BIO = `${WORK_PAGE_BIO_LEAD_PREFIX}${WORK_PAGE_BIO_CURRENT.label}${WORK_PAGE_BIO_PREVIOUS_INTRO}${WORK_PAGE_BIO_PREVIOUS_LIST}.`;
