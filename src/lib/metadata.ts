import type { Metadata } from 'next';
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/lib/site';

export function canonicalPath(path: string): Pick<Metadata, 'alternates'> {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return {
    alternates: {
      canonical: normalized,
    },
  };
}

export function createMetadata(overrides: Metadata = {}): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_TITLE,
      template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: SITE_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
    },
    ...overrides,
  };
}

export const adminRobots: Metadata['robots'] = {
  index: false,
  follow: false,
  nocache: true,
};
