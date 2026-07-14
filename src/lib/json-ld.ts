import type { ExportedProject, PortfolioExport } from '@/lib/content-export';
import {
  PROFILE,
  PROFILE_LAST_UPDATED,
  PROFILE_ROLES,
} from '@/data/profile';
import { getSiteUrl, SITE_CONTACT_EMAIL, SITE_NAME, SITE_SOCIAL_LINKS } from '@/lib/site';

type JsonLd = Record<string, unknown>;

function personId(siteUrl: string): string {
  return `${siteUrl}/#person`;
}

function websiteId(siteUrl: string): string {
  return `${siteUrl}/#website`;
}

function profilePageId(siteUrl: string): string {
  return `${siteUrl}/about#profilepage`;
}

function occupationEntries(): JsonLd[] {
  return PROFILE_ROLES.map((role) => {
    if (role.endDate) {
      return {
        '@type': 'Role',
        hasOccupation: {
          '@type': 'Occupation',
          name: role.role,
        },
        startDate: role.startDate,
        endDate: role.endDate,
      };
    }

    return {
      '@type': 'Occupation',
      name: role.role,
    };
  });
}

export function buildSiteGraph(): JsonLd {
  const siteUrl = getSiteUrl();
  const currentRole = PROFILE_ROLES.find((role) => role.current);

  const person: JsonLd = {
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: SITE_NAME,
    jobTitle: currentRole?.role ?? PROFILE.publicTitle,
    description: PROFILE.executiveSummary,
    url: siteUrl,
    email: SITE_CONTACT_EMAIL,
    knowsAbout: [...PROFILE.domains],
    worksFor: {
      '@type': 'Organization',
      name: currentRole?.company ?? 'JPMorgan Chase',
    },
    alumniOf: PROFILE_ROLES.filter((role) => !role.current).map((role) => ({
      '@type': 'Organization',
      name: role.company,
    })),
    hasOccupation: occupationEntries(),
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

export function buildProfilePageGraphFromProfile(): JsonLd {
  const siteUrl = getSiteUrl();
  const currentRole = PROFILE_ROLES.find((role) => role.current);

  const person: JsonLd = {
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: SITE_NAME,
    jobTitle: currentRole?.role ?? PROFILE.publicTitle,
    description: PROFILE.executiveSummary,
    worksFor: currentRole
      ? { '@type': 'Organization', name: currentRole.company }
      : undefined,
    alumniOf: PROFILE_ROLES.filter((role) => !role.current).map((role) => ({
      '@type': 'Organization',
      name: role.company,
    })),
    knowsAbout: [...PROFILE.domains],
    hasOccupation: occupationEntries(),
    url: `${siteUrl}/about`,
    email: SITE_CONTACT_EMAIL,
  };

  if (SITE_SOCIAL_LINKS.length > 0) {
    person.sameAs = SITE_SOCIAL_LINKS;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': profilePageId(siteUrl),
    url: `${siteUrl}/about`,
    dateModified: PROFILE_LAST_UPDATED,
    mainEntity: person,
  };
}

/** @deprecated Use buildProfilePageGraphFromProfile for /about. */
export function buildProfilePageGraph(data: PortfolioExport): JsonLd {
  void data;
  return buildProfilePageGraphFromProfile();
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

  if (project.impact?.length) {
    creativeWork.additionalProperty = project.impact.map((item) => ({
      '@type': 'PropertyValue',
      name: item.metric,
      value: item.value,
      description: item.context,
    }));
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
