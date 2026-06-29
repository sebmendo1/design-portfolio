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

export const WORK_PAGE_BIO =
  'Sebastian Mendo is a Senior Product Designer specialized in building AI-first digital products. Currently designing core agentic experiences at JPMorgan Chase. Previously at Salesforce and Writer AI.';
