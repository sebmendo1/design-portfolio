import type { ExportedProject, PortfolioExport } from '@/lib/content-export';
import {
  COMPANY_URLS,
  PROFILE,
  PROFILE_LAST_UPDATED,
  PROFILE_LEVEL,
  PROFILE_ROLES,
  getAlumniCompanies,
  getCurrentRole,
  getMonthsOfExperience,
  toSchemaEmploymentType,
  type ProfileRole,
} from '@/data/profile';
import {
  getSiteUrl,
  SITE_ADDRESS,
  SITE_CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SOCIAL_LINKS,
  SITE_TITLE,
} from '@/lib/site';

type JsonLd = Record<string, unknown>;

const LANGUAGE = 'en-US';

function personId(siteUrl: string): string {
  return `${siteUrl}/#person`;
}

function websiteId(siteUrl: string): string {
  return `${siteUrl}/#website`;
}

function organizationId(siteUrl: string): string {
  return `${siteUrl}/#organization`;
}

function postalAddress(): JsonLd {
  return {
    '@type': 'PostalAddress',
    addressLocality: SITE_ADDRESS.addressLocality,
    addressRegion: SITE_ADDRESS.addressRegion,
    addressCountry: SITE_ADDRESS.addressCountry,
  };
}

function contactPoint(): JsonLd {
  return {
    '@type': 'ContactPoint',
    email: SITE_CONTACT_EMAIL,
    contactType: 'professional',
    availableLanguage: 'English',
    url: `${getSiteUrl()}/contact`,
  };
}

export function practiceOrganizationNode(siteUrl: string): JsonLd {
  return {
    '@type': 'Organization',
    '@id': organizationId(siteUrl),
    name: SITE_NAME,
    legalName: SITE_NAME,
    url: siteUrl,
    email: SITE_CONTACT_EMAIL,
    description: SITE_DESCRIPTION,
    founder: { '@id': personId(siteUrl) },
    contactPoint: contactPoint(),
    address: postalAddress(),
    sameAs: SITE_SOCIAL_LINKS,
  };
}

function profilePageId(siteUrl: string): string {
  return `${siteUrl}/about#profilepage`;
}

function workListId(siteUrl: string): string {
  return `${siteUrl}/#case-studies`;
}

function organizationNode(company: string): JsonLd {
  const url = COMPANY_URLS[company];
  return url
    ? { '@type': 'Organization', name: company, url }
    : { '@type': 'Organization', name: company };
}

function placeNode(location?: string): JsonLd | undefined {
  if (!location) return undefined;
  return { '@type': 'Place', address: location };
}

/**
 * Primary occupation carries the seniority signals: standardized job category,
 * total months of experience, and the skill set behind the level.
 */
function primaryOccupation(): JsonLd {
  const currentRole = getCurrentRole();

  const occupation: JsonLd = {
    '@type': 'Occupation',
    name: PROFILE_LEVEL.title,
    occupationalCategory: {
      '@type': 'CategoryCode',
      codeValue: PROFILE_LEVEL.onetSocCode,
      name: PROFILE_LEVEL.onetSocName,
      inCodeSet: { '@type': 'CategoryCodeSet', name: 'O*NET-SOC' },
    },
    skills: [...PROFILE.capabilities],
    qualifications: PROFILE_LEVEL.scope,
    experienceRequirements: {
      '@type': 'OccupationalExperienceRequirements',
      monthsOfExperience: getMonthsOfExperience(),
    },
  };

  if (currentRole) {
    occupation.responsibilities = [...currentRole.responsibilities];
    const location = placeNode(currentRole.location);
    if (location) occupation.occupationLocation = location;
  }

  return occupation;
}

/** One Role node per position so tenure and scope are readable per employer. */
function employmentHistory(): JsonLd[] {
  return PROFILE_ROLES.map((role: ProfileRole) => {
    const node: JsonLd = {
      '@type': 'Role',
      roleName: role.role,
      startDate: role.startDate,
      description: `${role.role} at ${role.company} (${role.period}). ${role.summary}`,
      hasOccupation: {
        '@type': 'Occupation',
        name: role.role,
        skills: [...role.capabilities],
        responsibilities: [...role.responsibilities],
        ...(placeNode(role.location) ? { occupationLocation: placeNode(role.location) } : {}),
      },
    };

    if (role.endDate) node.endDate = role.endDate;

    const employmentType = toSchemaEmploymentType(role.employmentType);
    if (employmentType) node.employmentType = employmentType;

    return node;
  });
}

function personNode(siteUrl: string, url: string): JsonLd {
  const currentRole = getCurrentRole();

  const person: JsonLd = {
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: SITE_NAME,
    givenName: 'Sebastian',
    familyName: 'Mendo',
    jobTitle: currentRole?.role ?? PROFILE_LEVEL.title,
    /** Explicit level string so agents do not have to infer seniority. */
    disambiguatingDescription: `${PROFILE_LEVEL.seniority} level (${PROFILE_LEVEL.equivalentLevels.join(
      ' / ',
    )}) individual contributor. ${PROFILE_LEVEL.scope}`,
    description: PROFILE.executiveSummary,
    url,
    email: SITE_CONTACT_EMAIL,
    contactPoint: contactPoint(),
    address: postalAddress(),
    knowsLanguage: LANGUAGE,
    knowsAbout: [...PROFILE.domains, ...PROFILE.tools],
    hasOccupation: [primaryOccupation(), ...employmentHistory()],
    alumniOf: getAlumniCompanies().map(organizationNode),
  };

  if (currentRole) {
    person.worksFor = organizationNode(currentRole.company);
  }

  if (SITE_SOCIAL_LINKS.length > 0) {
    person.sameAs = SITE_SOCIAL_LINKS;
  }

  return person;
}

export function buildSiteGraph(): JsonLd {
  const siteUrl = getSiteUrl();

  const website: JsonLd = {
    '@type': 'WebSite',
    '@id': websiteId(siteUrl),
    name: SITE_NAME,
    alternateName: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    inLanguage: LANGUAGE,
    author: { '@id': personId(siteUrl) },
    publisher: { '@id': organizationId(siteUrl) },
    about: { '@id': personId(siteUrl) },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [practiceOrganizationNode(siteUrl), personNode(siteUrl, siteUrl), website],
  };
}

export function buildProfilePageGraphFromProfile(): JsonLd {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': profilePageId(siteUrl),
    url: `${siteUrl}/about`,
    name: `About ${SITE_NAME}`,
    inLanguage: LANGUAGE,
    dateModified: PROFILE_LAST_UPDATED,
    isPartOf: { '@id': websiteId(siteUrl) },
    mainEntity: personNode(siteUrl, `${siteUrl}/about`),
  };
}

/** @deprecated Use buildProfilePageGraphFromProfile for /about. */
export function buildProfilePageGraph(data: PortfolioExport): JsonLd {
  void data;
  return buildProfilePageGraphFromProfile();
}

function creativeWorkNode(project: ExportedProject, siteUrl: string): JsonLd {
  const projectUrl = project.url;

  const node: JsonLd = {
    '@type': 'CreativeWork',
    '@id': `${projectUrl}#creativework`,
    name: project.title,
    headline: project.title,
    abstract: project.tagline ?? project.description,
    description: project.description ?? project.tagline,
    url: projectUrl,
    inLanguage: LANGUAGE,
    isPartOf: { '@id': websiteId(siteUrl) },
    dateModified: PROFILE_LAST_UPDATED,
    image: `${projectUrl}/opengraph-image`,
    creator: { '@id': personId(siteUrl) },
  };

  /** Role wrapper states what I actually did on this project. */
  node.author = project.role
    ? {
        '@type': 'Role',
        roleName: project.role,
        author: { '@id': personId(siteUrl) },
      }
    : { '@id': personId(siteUrl) };

  if (project.company) {
    node.about = organizationNode(project.company);
    node.sourceOrganization = organizationNode(project.company);
  }

  if (project.tags.length) {
    node.keywords = project.tags.join(', ');
  }

  if (project.year) {
    node.dateCreated = String(project.year);
    node.copyrightYear = project.year;
  }

  if (project.impact?.length) {
    node.additionalProperty = project.impact.map((item) => ({
      '@type': 'PropertyValue',
      name: item.metric,
      value: item.value,
      description: `${item.context} (confidence: ${item.confidence})`,
    }));
  }

  return node;
}

export function buildCreativeWorkGraph(project: ExportedProject): JsonLd {
  const siteUrl = getSiteUrl();
  const projectUrl = project.url;

  const creativeWork = creativeWorkNode(project, siteUrl);
  creativeWork.mainEntityOfPage = { '@id': `${projectUrl}#webpage` };

  const webPage: JsonLd = {
    '@type': 'WebPage',
    '@id': `${projectUrl}#webpage`,
    url: projectUrl,
    name: `${project.title} — ${SITE_NAME}`,
    inLanguage: LANGUAGE,
    isPartOf: { '@id': websiteId(siteUrl) },
    about: { '@id': `${projectUrl}#creativework` },
    dateModified: PROFILE_LAST_UPDATED,
  };

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
    '@graph': [creativeWork, webPage, breadcrumbs],
  };
}

/** Home page graph: lets an agent enumerate every case study from one fetch. */
export function buildWorkCollectionGraph(projects: ExportedProject[]): JsonLd {
  const siteUrl = getSiteUrl();

  const collectionPage: JsonLd = {
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/#webpage`,
    url: siteUrl,
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    inLanguage: LANGUAGE,
    isPartOf: { '@id': websiteId(siteUrl) },
    about: { '@id': personId(siteUrl) },
    dateModified: PROFILE_LAST_UPDATED,
    mainEntity: { '@id': workListId(siteUrl) },
  };

  const itemList: JsonLd = {
    '@type': 'ItemList',
    '@id': workListId(siteUrl),
    name: 'Case studies',
    numberOfItems: projects.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: project.url,
      name: project.title,
      item: creativeWorkNode(project, siteUrl),
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [collectionPage, itemList],
  };
}
