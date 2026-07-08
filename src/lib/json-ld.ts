import type { ExportedProject, PortfolioExport } from '@/lib/content-export';
import { getSiteUrl, SITE_NAME, SITE_SOCIAL_LINKS } from '@/lib/site';

type JsonLd = Record<string, unknown>;

function personId(siteUrl: string): string {
  return `${siteUrl}/#person`;
}

function websiteId(siteUrl: string): string {
  return `${siteUrl}/#website`;
}

export function buildSiteGraph(): JsonLd {
  const siteUrl = getSiteUrl();
  const person: JsonLd = {
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: SITE_NAME,
    jobTitle: 'Senior Product Designer',
    url: siteUrl,
    worksFor: {
      '@type': 'Organization',
      name: 'JPMorgan Chase',
    },
  };

  if (SITE_SOCIAL_LINKS.length > 0) {
    person.sameAs = SITE_SOCIAL_LINKS;
  }

  const website: JsonLd = {
    '@type': 'WebSite',
    '@id': websiteId(siteUrl),
    name: SITE_NAME,
    url: siteUrl,
    author: { '@id': personId(siteUrl) },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [person, website],
  };
}

export function buildProfilePageGraph(data: PortfolioExport): JsonLd {
  const siteUrl = getSiteUrl();
  const alumniOf = data.experience
    .filter((exp) => !exp.current)
    .map((exp) => ({
      '@type': 'Organization',
      name: exp.company,
    }));

  const currentRole = data.experience.find((exp) => exp.current);

  const person: JsonLd = {
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: SITE_NAME,
    jobTitle: currentRole?.role ?? 'Senior Product Designer',
    worksFor: currentRole
      ? { '@type': 'Organization', name: currentRole.company }
      : undefined,
    alumniOf: alumniOf.length ? alumniOf : undefined,
    url: `${siteUrl}/about`,
  };

  if (SITE_SOCIAL_LINKS.length > 0) {
    person.sameAs = SITE_SOCIAL_LINKS;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: person,
  };
}

export function buildCreativeWorkGraph(project: ExportedProject): JsonLd {
  const siteUrl = getSiteUrl();
  const projectUrl = project.url;

  const creativeWork: JsonLd = {
    '@type': 'CreativeWork',
    '@id': `${projectUrl}#creativework`,
    name: project.title,
    abstract: project.tagline ?? project.description,
    description: project.description ?? project.tagline,
    url: projectUrl,
    author: { '@id': personId(siteUrl) },
    creator: { '@id': personId(siteUrl) },
    image: `${projectUrl}/opengraph-image`,
  };

  if (project.company) {
    creativeWork.about = { '@type': 'Organization', name: project.company };
  }

  if (project.tags.length) {
    creativeWork.keywords = project.tags.join(', ');
  }

  if (project.year) {
    creativeWork.dateCreated = String(project.year);
  }

  const breadcrumbs: JsonLd = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Work',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: project.title,
        item: projectUrl,
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [creativeWork, breadcrumbs],
  };
}
