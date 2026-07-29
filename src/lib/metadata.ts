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

function resolveMetadataText(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const record = value as { absolute?: string; default?: string };
    if (typeof record.absolute === 'string') return record.absolute;
    if (typeof record.default === 'string') return record.default;
  }
  return undefined;
}

export function createMetadata(overrides: Metadata = {}): Metadata {
  const siteUrl = getSiteUrl();
  const { openGraph: openGraphOverrides, twitter: twitterOverrides, ...restOverrides } = overrides;

  const openGraph = {
    type: 'website' as const,
    locale: 'en_US',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    ...openGraphOverrides,
  };

  const twitter = {
    card: 'summary_large_image' as const,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    ...twitterOverrides,
  };

  if (openGraphOverrides?.title !== undefined && twitterOverrides?.title === undefined) {
    const mirroredTitle = resolveMetadataText(openGraphOverrides.title);
    if (mirroredTitle) twitter.title = mirroredTitle;
  }

  if (openGraphOverrides?.description !== undefined && twitterOverrides?.description === undefined) {
    const mirroredDescription = resolveMetadataText(openGraphOverrides.description);
    if (mirroredDescription) twitter.description = mirroredDescription;
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_TITLE,
      template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph,
    twitter,
    ...restOverrides,
  };
}

export const adminRobots: Metadata['robots'] = {
  index: false,
  follow: false,
  nocache: true,
};
