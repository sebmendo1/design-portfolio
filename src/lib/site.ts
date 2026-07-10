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
export const SITE_TITLE = 'Sebastian Mendo — Senior Product Designer';
export const SITE_DESCRIPTION =
  'Portfolio of Sebastian Mendo, Senior Product Designer at JPMorgan Chase. AI-first product design for banking, voice, and enterprise software.';

export const SITE_CONTACT_EMAIL = 'contact@sebastianmendo.design';

/** Profile URLs for JSON-LD sameAs and external identity links. */
export const SITE_LINKEDIN_URL = 'https://www.linkedin.com/in/sebastianmendo/';

export const SITE_SOCIAL_LINKS: string[] = [SITE_LINKEDIN_URL];

export const WORK_PAGE_BIO =
  'Sebastian is a Senior Product Designer building core agentic banking experiences for millions of users at JPMorgan Chase. Previously at Salesforce, and Writer AI.';
