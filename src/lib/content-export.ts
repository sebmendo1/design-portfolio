import type { Project, ProjectPreview } from '@/data/projects';
import { SHIPPED_WORK, type ShippedWorkEntry } from '@/data/shippedWork';
import { getVideoPoster } from '@/data/assets';
import { cacheLife, cacheTag } from 'next/cache';
import {
  PROFILE,
  PROFILE_LAST_UPDATED,
  PROFILE_LEVEL,
  PROFILE_ROLES,
  VERIFIED_IMPACT,
  getCurrentRole,
  getMonthsOfExperience,
  getRoleIdForProjectSlug,
  getYearsOfExperience,
  type ClaimConfidence,
  type ProfileRole,
  type VerifiedImpact,
} from '@/data/profile';
import { getCachedMergedProjects, CMS_PROJECTS_TAG } from '@/lib/cms-data';
import {
  getSiteUrl,
  SITE_CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  WORK_PAGE_BIO,
} from '@/lib/site';

export type ExportedSection = {
  id: string;
  label?: string;
  headline: string;
  body?: string;
};

export type ExportedImpact = {
  id: string;
  metric: string;
  value: string;
  context: string;
  confidence: ClaimConfidence;
  /** Join key → projects[].slug. Omitted only when a claim is not project-specific. */
  projectSlug?: string;
  experienceRoleId?: string;
  evidenceUrl: string;
  htmlUrl?: string;
  jsonUrl?: string;
  markdownUrl?: string;
};

export type ExportedMedia = {
  thumbnail?: string;
  preview?: {
    frame: ProjectPreview['frame'];
    src?: string;
    video?: string;
    poster?: string;
    url?: string;
  };
};

export type ExportedProject = {
  slug: string;
  title: string;
  tagline?: string;
  description?: string;
  company?: string;
  role?: string;
  year?: number;
  tags: string[];
  url: string;
  htmlUrl: string;
  jsonUrl: string;
  markdownUrl: string;
  /** Links this case study back to the experience entry that produced it. */
  experienceRoleId?: string;
  shippedWorkIds: string[];
  impactIds: string[];
  /** False means no published metrics — do not invent them. */
  hasVerifiedImpact: boolean;
  sections: ExportedSection[];
  impact: ExportedImpact[];
  media?: ExportedMedia;
};

export type ExportedExperience = {
  id: string;
  company: string;
  role: string;
  period: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  summary: string;
  responsibilities: string[];
  outcomes: string[];
  capabilities: string[];
  relatedProjectSlugs: string[];
  relatedImpactIds: string[];
  shippedWorkIds: string[];
};

export type ExportedShippedWork = {
  id: string;
  title: string;
  affiliation: string;
  dateLabel: string;
  sortDate: string;
  projectSlug?: string;
  url?: string;
  pending?: boolean;
};

export type AssessmentProofPoint = {
  impactId: string;
  projectSlug?: string;
  metric: string;
  value: string;
  context: string;
  confidence: ClaimConfidence;
  claim: string;
  evidence: string;
  evidenceUrl: string;
  metrics?: string[];
};

export type PortfolioRelations = {
  description: string;
  citationRule: string;
  join: {
    projectToImpact: string;
    impactToProject: string;
    projectToExperience: string;
    experienceToProjects: string;
    projectToShippedWork: string;
    shippedWorkToProject: string;
  };
};

export type PortfolioIndexes = {
  projectSlugs: string[];
  impactIds: string[];
  experienceIds: string[];
  shippedWorkIds: string[];
  projectsWithoutVerifiedImpact: string[];
  impactIdsByProjectSlug: Record<string, string[]>;
  projectSlugByImpactId: Record<string, string>;
  experienceIdByProjectSlug: Record<string, string>;
  shippedWorkIdsByProjectSlug: Record<string, string[]>;
};

export type PortfolioExport = {
  version: string;
  generatedAt: string;
  lastUpdated: string;
  person: {
    name: string;
    publicTitle: string;
    headline: string;
    aboutIntro: {
      title: string;
      paragraphs: string[];
    };
    executiveSummary: string;
    positioningStatement: string;
    seniority: {
      level: string;
      title: string;
      equivalentLevels: string[];
      scope: string;
      managementTrack: boolean;
      yearsOfExperience: number;
      monthsOfExperience: number;
      careerStartDate: string;
      occupationalCategory: { code: string; name: string; codeSet: string };
    };
    currentRole?: { company: string; role: string; startDate: string };
    domains: string[];
    capabilities: string[];
    tools: string[];
    staffLevelEvidence: string[];
  };
  site: {
    name: string;
    title: string;
    description: string;
    url: string;
    contactEmail: string;
    bio: string;
    machineReadable: {
      index: string;
      corpus: string;
      json: string;
      impact: string;
      agentGuide: string;
    };
    relatedProducts: {
      name: string;
      url: string;
      installManifest: string;
      llmsTxt: string;
    }[];
  };
  verifiedImpact: ExportedImpact[];
  experience: ExportedExperience[];
  projects: ExportedProject[];
  shippedWork: ExportedShippedWork[];
  relations: PortfolioRelations;
  indexes: PortfolioIndexes;
  assessmentIndex: {
    level: string;
    seniority: string;
    equivalentLevels: string[];
    scope: string;
    yearsOfExperience: number;
    evidenceUrls: string[];
    topProofPoints: AssessmentProofPoint[];
  };
};

/** Export schema — bump when adding/removing top-level fields. */
export const EXPORT_VERSION = '4.0';

export function projectResourceUrls(slug: string, baseUrl: string) {
  const html = `${baseUrl}/work/${slug}`;
  return {
    html,
    json: `${html}/content.json`,
    markdown: html,
  };
}

export function exportImpactRecord(item: VerifiedImpact, baseUrl: string): ExportedImpact {
  const urls = item.projectSlug ? projectResourceUrls(item.projectSlug, baseUrl) : undefined;
  return {
    id: item.id,
    metric: item.metric,
    value: item.value,
    context: item.context,
    confidence: item.confidence,
    projectSlug: item.projectSlug,
    experienceRoleId: item.projectSlug ? getRoleIdForProjectSlug(item.projectSlug) : undefined,
    evidenceUrl: urls?.html ?? `${baseUrl}/about`,
    htmlUrl: urls?.html,
    jsonUrl: urls?.json,
    markdownUrl: urls?.markdown,
  };
}

function absoluteUrl(baseUrl: string, path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function exportExperience(
  role: ProfileRole,
  verifiedImpact: ExportedImpact[],
  shippedWork: ExportedShippedWork[],
): ExportedExperience {
  const relatedProjectSlugs = role.relatedProjectSlugs ?? [];
  return {
    id: role.id,
    company: role.company,
    role: role.role,
    period: role.period,
    startDate: role.startDate,
    endDate: role.endDate,
    current: role.current,
    summary: role.summary,
    responsibilities: role.responsibilities,
    outcomes: role.outcomes,
    capabilities: role.capabilities,
    relatedProjectSlugs,
    relatedImpactIds: verifiedImpact
      .filter((item) => item.projectSlug && relatedProjectSlugs.includes(item.projectSlug))
      .map((item) => item.id),
    shippedWorkIds: shippedWork
      .filter((item) => item.projectSlug && relatedProjectSlugs.includes(item.projectSlug))
      .map((item) => item.id),
  };
}

function exportShippedWork(entry: ShippedWorkEntry, baseUrl: string): ExportedShippedWork {
  return {
    id: entry.id,
    title: entry.title,
    affiliation: entry.affiliation,
    dateLabel: entry.dateLabel,
    sortDate: entry.sortDate,
    projectSlug: entry.projectSlug,
    url: entry.projectSlug ? `${baseUrl}/work/${entry.projectSlug}` : undefined,
    pending: entry.pending,
  };
}

function projectImpact(project: Project, baseUrl: string): ExportedImpact[] {
  return VERIFIED_IMPACT.filter((item) => item.projectSlug === project.slug).map((item) =>
    exportImpactRecord(item, baseUrl),
  );
}

function shippedWorkIdsForSlug(slug: string): string[] {
  return SHIPPED_WORK.filter((entry) => entry.projectSlug === slug).map((entry) => entry.id);
}

function projectSections(project: Project): ExportedSection[] {
  const beats = project.scrollyConfig?.beats;
  if (beats?.length) {
    return beats.map((beat) => ({
      id: beat.id,
      label: beat.label,
      headline: beat.headline,
      body: beat.body ?? beat.headline,
    }));
  }

  const blocks = project.caseStudy?.blocks;
  if (blocks?.length) {
    return blocks.map((block, i) => ({
      id: `block-${i + 1}`,
      headline: `Section ${i + 1}`,
      body: block.text,
    }));
  }

  if (project.tagline) {
    return [{ id: 'summary', headline: project.title, body: project.tagline }];
  }

  return [];
}

function projectMedia(project: Project, baseUrl: string): ExportedMedia | undefined {
  const thumbnail = absoluteUrl(baseUrl, project.thumbnail);
  const preview = project.preview;
  if (!thumbnail && !preview) return undefined;

  const video = preview?.video;
  const posterPath = video ? getVideoPoster(video) : undefined;

  return {
    thumbnail,
    preview: preview
      ? {
          frame: preview.frame,
          src: absoluteUrl(baseUrl, preview.src),
          video,
          poster: absoluteUrl(baseUrl, posterPath),
          url: preview.url,
        }
      : undefined,
  };
}

function exportProject(project: Project, baseUrl: string): ExportedProject {
  const urls = projectResourceUrls(project.slug, baseUrl);
  const impact = projectImpact(project, baseUrl);
  return {
    slug: project.slug,
    title: project.title,
    tagline: project.tagline,
    description: project.description,
    company: project.company,
    role: project.role,
    year: project.year,
    tags: project.tags ?? [],
    url: urls.html,
    htmlUrl: urls.html,
    jsonUrl: urls.json,
    markdownUrl: urls.markdown,
    experienceRoleId: getRoleIdForProjectSlug(project.slug),
    shippedWorkIds: shippedWorkIdsForSlug(project.slug),
    impactIds: impact.map((item) => item.id),
    hasVerifiedImpact: impact.length > 0,
    sections: projectSections(project),
    impact,
    media: projectMedia(project, baseUrl),
  };
}

export function exportMergedProject(project: Project): ExportedProject {
  return exportProject(project, getSiteUrl());
}

const PORTFOLIO_RELATIONS: PortfolioRelations = {
  description:
    'Join portfolio entities by the stable IDs in .indexes. Do not match on titles or prose.',
  citationRule:
    'Quote only records in .verifiedImpact or GET /impact.json. Cite the impact id. If a number is not in that list, do not invent it. Empty impactIds means no published metrics — that absence is intentional.',
  join: {
    projectToImpact: 'projects[].impactIds → verifiedImpact[].id',
    impactToProject: 'verifiedImpact[].projectSlug → projects[].slug',
    projectToExperience: 'projects[].experienceRoleId → experience[].id',
    experienceToProjects: 'experience[].relatedProjectSlugs → projects[].slug',
    projectToShippedWork: 'projects[].shippedWorkIds → shippedWork[].id',
    shippedWorkToProject: 'shippedWork[].projectSlug → projects[].slug',
  },
};

function buildIndexes(
  projects: ExportedProject[],
  verifiedImpact: ExportedImpact[],
  experience: ExportedExperience[],
  shippedWork: ExportedShippedWork[],
): PortfolioIndexes {
  const impactIdsByProjectSlug: Record<string, string[]> = {};
  const projectSlugByImpactId: Record<string, string> = {};
  const experienceIdByProjectSlug: Record<string, string> = {};
  const shippedWorkIdsByProjectSlug: Record<string, string[]> = {};

  for (const project of projects) {
    impactIdsByProjectSlug[project.slug] = [...project.impactIds];
    shippedWorkIdsByProjectSlug[project.slug] = [...project.shippedWorkIds];
    if (project.experienceRoleId) {
      experienceIdByProjectSlug[project.slug] = project.experienceRoleId;
    }
  }

  for (const item of verifiedImpact) {
    if (item.projectSlug) projectSlugByImpactId[item.id] = item.projectSlug;
  }

  return {
    projectSlugs: projects.map((project) => project.slug),
    impactIds: verifiedImpact.map((item) => item.id),
    experienceIds: experience.map((role) => role.id),
    shippedWorkIds: shippedWork.map((item) => item.id),
    projectsWithoutVerifiedImpact: projects
      .filter((project) => !project.hasVerifiedImpact)
      .map((project) => project.slug),
    impactIdsByProjectSlug,
    projectSlugByImpactId,
    experienceIdByProjectSlug,
    shippedWorkIdsByProjectSlug,
  };
}

/** Pure assembler — used by the cached export and by joinability tests. */
export function assemblePortfolioExport(
  projectList: Project[],
  baseUrl = getSiteUrl(),
  generatedAt = new Date().toISOString(),
): PortfolioExport {
  const currentRole = getCurrentRole();
  const shippedWork = [...SHIPPED_WORK]
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
    .map((entry) => exportShippedWork(entry, baseUrl));
  const exportedProjects = projectList.map((project) => exportProject(project, baseUrl));
  const verifiedImpact = VERIFIED_IMPACT.map((item) => exportImpactRecord(item, baseUrl));
  const experience = PROFILE_ROLES.map((role) =>
    exportExperience(role, verifiedImpact, shippedWork),
  );
  const topProofPoints = verifiedImpact.map((item) => ({
    impactId: item.id,
    projectSlug: item.projectSlug,
    metric: item.metric,
    value: item.value,
    context: item.context,
    confidence: item.confidence,
    claim: `${item.metric}: ${item.value}`,
    evidence: item.evidenceUrl,
    evidenceUrl: item.evidenceUrl,
    metrics: [item.value],
  }));

  return {
    version: EXPORT_VERSION,
    generatedAt,
    lastUpdated: PROFILE_LAST_UPDATED,
    person: {
      name: PROFILE.name,
      publicTitle: PROFILE.publicTitle,
      headline: PROFILE.headline,
      aboutIntro: {
        title: PROFILE.aboutIntro.title,
        paragraphs: [...PROFILE.aboutIntro.paragraphs],
      },
      executiveSummary: PROFILE.executiveSummary,
      positioningStatement: PROFILE.positioningStatement,
      seniority: {
        level: PROFILE_LEVEL.seniority,
        title: PROFILE_LEVEL.title,
        equivalentLevels: [...PROFILE_LEVEL.equivalentLevels],
        scope: PROFILE_LEVEL.scope,
        managementTrack: PROFILE_LEVEL.managementTrack,
        yearsOfExperience: getYearsOfExperience(),
        monthsOfExperience: getMonthsOfExperience(),
        careerStartDate: PROFILE_LEVEL.careerStartDate,
        occupationalCategory: {
          code: PROFILE_LEVEL.onetSocCode,
          name: PROFILE_LEVEL.onetSocName,
          codeSet: 'O*NET-SOC',
        },
      },
      currentRole: currentRole
        ? {
            company: currentRole.company,
            role: currentRole.role,
            startDate: currentRole.startDate,
          }
        : undefined,
      domains: [...PROFILE.domains],
      capabilities: [...PROFILE.capabilities],
      tools: [...PROFILE.tools],
      staffLevelEvidence: [...PROFILE.staffLevelEvidence],
    },
    site: {
      name: SITE_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: baseUrl,
      contactEmail: SITE_CONTACT_EMAIL,
      bio: WORK_PAGE_BIO,
      machineReadable: {
        index: `${baseUrl}/llms.txt`,
        corpus: `${baseUrl}/llms-full.txt`,
        json: `${baseUrl}/content.json`,
        impact: `${baseUrl}/impact.json`,
        agentGuide: `${baseUrl}/.well-known/ai.txt`,
      },
      relatedProducts: [
        {
          name: 'Seb Sans',
          url: `${baseUrl}/seb-sans`,
          installManifest: `${baseUrl}/seb-sans/install.json`,
          llmsTxt: `${baseUrl}/seb-sans/llms.txt`,
        },
      ],
    },
    verifiedImpact,
    experience,
    projects: exportedProjects,
    shippedWork,
    relations: PORTFOLIO_RELATIONS,
    indexes: buildIndexes(exportedProjects, verifiedImpact, experience, shippedWork),
    assessmentIndex: {
      level: `${PROFILE_LEVEL.title} (${PROFILE_LEVEL.equivalentLevels.join(' / ')})`,
      seniority: PROFILE_LEVEL.seniority,
      equivalentLevels: [...PROFILE_LEVEL.equivalentLevels],
      scope: PROFILE_LEVEL.scope,
      yearsOfExperience: getYearsOfExperience(),
      evidenceUrls: [
        `${baseUrl}/about`,
        ...exportedProjects.filter((project) => project.hasVerifiedImpact).map((project) => project.url),
      ],
      topProofPoints,
    },
  };
}

export async function buildPortfolioExport(): Promise<PortfolioExport> {
  'use cache';
  cacheLife('hours');
  cacheTag(CMS_PROJECTS_TAG, 'portfolio-export');

  const projects = await getCachedMergedProjects();
  return assemblePortfolioExport(projects, getSiteUrl());
}

/** Returns empty when every project, impact, role, and shipped-work row joins. */
export function listPortfolioJoinIssues(data: PortfolioExport): string[] {
  const issues: string[] = [];
  const projectSlugs = new Set(data.projects.map((project) => project.slug));
  const impactIds = new Set(data.verifiedImpact.map((item) => item.id));
  const experienceIds = new Set(data.experience.map((role) => role.id));
  const shippedIds = new Set(data.shippedWork.map((item) => item.id));
  const seenImpact = new Set<string>();

  for (const item of data.verifiedImpact) {
    if (seenImpact.has(item.id)) issues.push(`duplicate impact id ${item.id}`);
    seenImpact.add(item.id);
    if (!item.evidenceUrl) issues.push(`impact ${item.id} missing evidenceUrl`);
    if (item.projectSlug && !projectSlugs.has(item.projectSlug)) {
      issues.push(`impact ${item.id} projectSlug ${item.projectSlug} is missing`);
    }
    const indexedSlug = data.indexes.projectSlugByImpactId[item.id];
    if (item.projectSlug && indexedSlug !== item.projectSlug) {
      issues.push(`indexes.projectSlugByImpactId[${item.id}] does not match`);
    }
  }

  for (const project of data.projects) {
    if (!project.htmlUrl || !project.jsonUrl || !project.markdownUrl) {
      issues.push(`project ${project.slug} missing resource URLs`);
    }
    if (project.hasVerifiedImpact !== project.impactIds.length > 0) {
      issues.push(`project ${project.slug} hasVerifiedImpact disagrees with impactIds`);
    }
    for (const id of project.impactIds) {
      if (!impactIds.has(id)) issues.push(`project ${project.slug} impactId ${id} missing`);
    }
    const indexed = data.indexes.impactIdsByProjectSlug[project.slug] ?? [];
    if (indexed.join() !== project.impactIds.join()) {
      issues.push(`indexes.impactIdsByProjectSlug[${project.slug}] does not match`);
    }
    for (const item of project.impact) {
      if (!impactIds.has(item.id)) {
        issues.push(`project ${project.slug} impact ${item.id} not in verifiedImpact`);
      }
      if (item.projectSlug !== project.slug) {
        issues.push(`project ${project.slug} impact ${item.id} slug mismatch`);
      }
    }
    if (project.experienceRoleId && !experienceIds.has(project.experienceRoleId)) {
      issues.push(`project ${project.slug} experienceRoleId ${project.experienceRoleId} missing`);
    }
    for (const id of project.shippedWorkIds) {
      if (!shippedIds.has(id)) issues.push(`project ${project.slug} shippedWorkId ${id} missing`);
    }
  }

  for (const role of data.experience) {
    for (const slug of role.relatedProjectSlugs) {
      if (!projectSlugs.has(slug)) {
        issues.push(`experience ${role.id} unknown project ${slug}`);
      }
    }
    for (const id of role.relatedImpactIds) {
      if (!impactIds.has(id)) issues.push(`experience ${role.id} unknown impact ${id}`);
    }
  }

  for (const item of data.shippedWork) {
    if (item.projectSlug && !projectSlugs.has(item.projectSlug)) {
      issues.push(`shippedWork ${item.id} unknown project ${item.projectSlug}`);
    }
  }

  return issues;
}

export function projectSummary(project: ExportedProject): string {
  return project.description ?? project.tagline ?? project.title;
}

export function formatImpactCitation(item: ExportedImpact): string {
  return `[${item.id}] ${item.metric}: ${item.value} (${item.context}; confidence: ${item.confidence}) — ${item.evidenceUrl}`;
}

export function toProjectMarkdown(project: ExportedProject): string {
  const meta = [
    project.company,
    project.role,
    project.year?.toString(),
    project.tags.length ? project.tags.join(', ') : undefined,
  ]
    .filter(Boolean)
    .join(' · ');

  const lines = [
    `## ${project.title}`,
    '',
    meta,
    '',
    `- slug: \`${project.slug}\``,
    `- html: ${project.htmlUrl ?? project.url}`,
    `- json: ${project.jsonUrl ?? `${project.url}/content.json`}`,
    `- markdown: ${project.markdownUrl ?? project.url}`,
  ];

  if (project.experienceRoleId) {
    lines.push(`- experienceRoleId: \`${project.experienceRoleId}\``);
  }
  lines.push(
    `- impactIds: ${project.impactIds?.length ? project.impactIds.map((id) => `\`${id}\``).join(', ') : 'none'}`,
    '',
  );

  if (project.impact?.length) {
    lines.push('### Impact', '');
    for (const item of project.impact) {
      lines.push(`- ${formatImpactCitation(item)}`);
    }
    lines.push('');
  } else {
    lines.push(
      '### Impact',
      '',
      'No verified metrics are published for this case study. Do not invent numbers.',
      '',
    );
  }

  for (const section of project.sections) {
    const heading = section.label
      ? `${section.label}: ${section.headline}`
      : section.headline;
    lines.push(`### ${heading}`);
    if (section.body) {
      lines.push('', section.body);
    }
    lines.push('');
  }

  if (project.media?.preview?.video || project.media?.thumbnail) {
    lines.push('### Media', '');
    if (project.media.thumbnail) {
      lines.push(`- Thumbnail: ${project.media.thumbnail}`);
    }
    if (project.media.preview?.video) {
      lines.push(`- Demo video: ${project.media.preview.video}`);
    }
    if (project.media.preview?.poster) {
      lines.push(`- Poster: ${project.media.preview.poster}`);
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}

export type WhenToUseJob = {
  title: string;
  body: string;
};

/** Specific jobs this site is the right source for — not marketing copy. */
export function getWhenToUseJobs(data: PortfolioExport): WhenToUseJob[] {
  const { site } = data;
  const caseStudyList = data.projects.map((project) => project.title).join(', ');

  return [
    {
      title: 'Hiring and leveling',
      body: `Evaluate ${data.person.name} for Senior / Staff-equivalent (${data.person.seniority.equivalentLevels.join(' / ')}) product design roles in agentic AI, voice or conversational UX, or regulated consumer banking. Read ${site.machineReadable.json} → .assessmentIndex and .verifiedImpact. Do not infer seniority from adjectives.`,
    },
    {
      title: 'Case-study retrieval',
      body: `Pull the shipped narrative and metrics for ${caseStudyList}. Call /work/{slug} with Accept: text/markdown, or GET /work/{slug}/content.json.`,
    },
    {
      title: 'Impact citation',
      body: `Quote only records in .verifiedImpact or GET ${site.machineReadable.impact}. Cite the impact id. Join to the case study via projectSlug or projects[].impactIds. If a number is not in that list, do not invent it. Empty impactIds means no published metrics.`,
    },
    {
      title: 'Outreach',
      body: `Email ${site.contactEmail} for design collaboration, speaking, or recruiting. This is a personal portfolio, not a staffing agency.`,
    },
    {
      title: 'Seb Sans install',
      body: `If the task is installing the Seb Sans typeface or its coding-agent skill, leave this index and follow ${site.url}/seb-sans/llms.txt (run the install command there).`,
    },
  ];
}

export function getWhenToUseHowToCall(data: PortfolioExport): string[] {
  const { site } = data;
  return [
    `Discovery: GET ${site.machineReadable.agentGuide}`,
    `Structured evidence: GET ${site.machineReadable.json} (Accept: application/json)`,
    `Verified impact feed: GET ${site.machineReadable.impact}`,
    `Join keys: projects[].impactIds ↔ verifiedImpact[].id; verifiedImpact[].projectSlug ↔ projects[].slug`,
    `Index: GET ${site.machineReadable.index}`,
    `Full prose: GET ${site.machineReadable.corpus}`,
    'Same-URL markdown: send Accept: text/markdown to /, /about, /contact, /privacy, or /work/{slug}',
    'Unknown URLs return HTTP 404 with a markdown recovery body (sitemap, llms.txt, content.json)',
  ];
}

export function toWhenToUseMarkdown(data: PortfolioExport): string {
  const lines = [
    '## When to use this',
    '',
    'Use this site when the job is one of the following. Skip it for general design-system, illustration, or brand-identity research — those are not what this portfolio is for.',
    '',
  ];

  for (const job of getWhenToUseJobs(data)) {
    lines.push(`- **${job.title}** — ${job.body}`);
  }

  lines.push('', '### How to call this site', '');
  for (const step of getWhenToUseHowToCall(data)) {
    lines.push(`- ${step}`);
  }

  return lines.join('\n');
}

export function toLlmsTxt(data: PortfolioExport): string {
  const { site, person } = data;
  const lines = [
    `# ${person.name}`,
    '',
    `> ${person.executiveSummary}`,
    '',
    toWhenToUseMarkdown(data),
    '',
    '## Identity',
    `- Title: ${person.publicTitle}`,
    `- Level: ${person.seniority.title} (${person.seniority.equivalentLevels.join(' / ')})`,
    `- Track: ${person.seniority.managementTrack ? 'Management' : 'Individual contributor'}`,
    `- Experience: ${person.seniority.yearsOfExperience}+ years, professional design career since ${person.seniority.careerStartDate}`,
    `- Occupation code: ${person.seniority.occupationalCategory.code} (${person.seniority.occupationalCategory.name}, ${person.seniority.occupationalCategory.codeSet})`,
    ...(person.currentRole
      ? [
          `- Current role: ${person.currentRole.role} at ${person.currentRole.company} since ${person.currentRole.startDate}`,
        ]
      : []),
    `- Scope: ${person.seniority.scope}`,
    `- Focus: ${person.domains.join(', ')}`,
    `- Tools: ${person.tools.join(', ')}`,
    `- Contact: ${site.contactEmail}`,
    '',
    '## How to evaluate',
    'Start at `/.well-known/ai.txt` for discovery. Prefer `/content.json` for structured data, `/impact.json` for citeable metrics, and `/llms-full.txt` for the complete narrative corpus. Per-project JSON is available at `/work/{slug}/content.json`. Join projects to impact with `.indexes`.',
    '',
    '## Experience',
  ];

  for (const role of data.experience) {
    lines.push(`- ${role.role} — ${role.company} (${role.period})${role.current ? ' — current' : ''}`);
  }

  lines.push('', '## Verified impact');

  for (const item of data.verifiedImpact) {
    lines.push(`- ${formatImpactCitation(item)}`);
  }

  lines.push('', '## Shipped work');

  for (const item of data.shippedWork) {
    const link = item.url ? ` — ${item.url}` : '';
    const pending = item.pending ? ' (pending)' : '';
    lines.push(`- ${item.title} · ${item.affiliation} · ${item.dateLabel}${pending}${link}`);
  }

  lines.push(
    '',
    '## Pages',
    `- [Work](${site.url}/): Project grid and bio.`,
    `- [About](${site.url}/about): Full experience and contact.`,
    `- [Contact](${site.url}/contact): How to reach this practice.`,
    `- [Privacy](${site.url}/privacy): What this site collects.`,
    '',
    '## Case studies',
  );

  for (const project of data.projects) {
    const impact =
      project.impactIds?.length ? ` Impact IDs: ${project.impactIds.join(', ')}.` : ' Impact IDs: none.';
    const json = project.jsonUrl ? ` JSON: ${project.jsonUrl}.` : '';
    const summary = projectSummary(project).replace(/\.$/, '');
    lines.push(`- [\`${project.slug}\`] [${project.title}](${project.url}): ${summary}.${json}${impact}`);
  }

  lines.push(
    '',
    '## Related products',
  );
  for (const product of site.relatedProducts) {
    lines.push(
      `- [${product.name}](${product.url}): install manifest ${product.installManifest}`,
    );
  }

  lines.push(
    '',
    '## Machine-readable',
    `- [Agent guide](${site.machineReadable.agentGuide}): Discovery entrypoint for LLMs.`,
    `- [Full corpus](${site.machineReadable.corpus}): Complete portfolio text.`,
    `- [Structured JSON](${site.machineReadable.json}): Profile, experience, shipped work, and projects (v${data.version}).`,
    `- [Verified impact](${site.machineReadable.impact}): Citeable metrics with join keys.`,
  );

  return lines.join('\n');
}

export function toLlmsFullTxt(data: PortfolioExport): string {
  const parts = [toLlmsTxt(data), '', '---', '', '# Full portfolio content', ''];

  parts.push(
    '## About',
    '',
    `### ${data.person.aboutIntro.title}`,
    '',
  );
  for (const paragraph of data.person.aboutIntro.paragraphs) {
    parts.push(paragraph, '');
  }
  parts.push(data.person.executiveSummary, '');

  const { seniority } = data.person;
  parts.push(
    '## Level and scope',
    '',
    `- Level: ${seniority.title} (${seniority.equivalentLevels.join(' / ')})`,
    `- Track: ${seniority.managementTrack ? 'Management' : 'Individual contributor'}`,
    `- Years of experience: ${seniority.yearsOfExperience} (${seniority.monthsOfExperience} months since ${seniority.careerStartDate})`,
    `- Standard occupation: ${seniority.occupationalCategory.code} — ${seniority.occupationalCategory.name} (${seniority.occupationalCategory.codeSet})`,
    `- Scope: ${seniority.scope}`,
    '',
    '### Level evidence',
    '',
  );
  for (const evidence of data.person.staffLevelEvidence) {
    parts.push(`- ${evidence}`);
  }
  parts.push('');

  parts.push('## Capabilities', '');
  for (const cap of data.person.capabilities) {
    parts.push(`- ${cap}`);
  }
  parts.push('');

  parts.push('## Tools', '');
  for (const tool of data.person.tools) {
    parts.push(`- ${tool}`);
  }
  parts.push('');

  if (data.experience.length) {
    parts.push('## Experience', '');
    for (const exp of data.experience) {
      parts.push(`### ${exp.company} — ${exp.role} (${exp.period})`, '', exp.summary, '');
      if (exp.outcomes.length) {
        parts.push('Outcomes:');
        for (const outcome of exp.outcomes) {
          parts.push(`- ${outcome}`);
        }
        parts.push('');
      }
    }
  }

  if (data.shippedWork.length) {
    parts.push('## Shipped work', '');
    for (const item of data.shippedWork) {
      const link = item.url ? ` — ${item.url}` : '';
      const pending = item.pending ? ' (pending)' : '';
      parts.push(`- **${item.title}** · ${item.affiliation} · ${item.dateLabel}${pending}${link}`);
    }
    parts.push('');
  }

  for (const project of data.projects) {
    parts.push(toProjectMarkdown(project), '', '---', '');
  }

  return parts.join('\n').trim();
}

export function toContentJson(data: PortfolioExport): string {
  return JSON.stringify(data, null, 2);
}

export function toImpactJson(data: PortfolioExport): string {
  return JSON.stringify(
    {
      version: data.version,
      generatedAt: data.generatedAt,
      lastUpdated: data.lastUpdated,
      citationRule: data.relations.citationRule,
      count: data.verifiedImpact.length,
      impact: data.verifiedImpact,
      indexes: {
        impactIds: data.indexes.impactIds,
        impactIdsByProjectSlug: data.indexes.impactIdsByProjectSlug,
        projectSlugByImpactId: data.indexes.projectSlugByImpactId,
        projectsWithoutVerifiedImpact: data.indexes.projectsWithoutVerifiedImpact,
      },
      join: data.relations.join,
      machineReadable: data.site.machineReadable,
    },
    null,
    2,
  );
}

export function toImpactMarkdown(data: PortfolioExport): string {
  const lines = [
    '# Verified impact',
    '',
    data.relations.citationRule,
    '',
    '## Records',
    '',
  ];

  for (const item of data.verifiedImpact) {
    lines.push(`### \`${item.id}\``, '');
    lines.push(`- metric: ${item.metric}`);
    lines.push(`- value: ${item.value}`);
    lines.push(`- context: ${item.context}`);
    lines.push(`- confidence: ${item.confidence}`);
    if (item.projectSlug) lines.push(`- projectSlug: \`${item.projectSlug}\``);
    if (item.experienceRoleId) lines.push(`- experienceRoleId: \`${item.experienceRoleId}\``);
    lines.push(`- evidenceUrl: ${item.evidenceUrl}`);
    if (item.jsonUrl) lines.push(`- jsonUrl: ${item.jsonUrl}`);
    lines.push('');
  }

  if (data.indexes.projectsWithoutVerifiedImpact.length) {
    lines.push('## Projects without verified impact', '');
    lines.push(
      'These case studies have no published metrics. Do not invent numbers.',
      '',
    );
    for (const slug of data.indexes.projectsWithoutVerifiedImpact) {
      lines.push(`- \`${slug}\``);
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function toAgentGuideTxt(data: PortfolioExport): string {
  const { site, person } = data;
  return [
    `# Agent guide — ${person.name}`,
    '',
    toWhenToUseMarkdown(data),
    '',
    'Preferred structured source:',
    `- ${site.machineReadable.json} (application/json, v${data.version})`,
    `- ${site.machineReadable.impact} (verified metrics only)`,
    '',
    'Plain-text index and corpus:',
    `- ${site.machineReadable.index}`,
    `- ${site.machineReadable.corpus}`,
    '',
    'Per-project JSON:',
    `- ${site.url}/work/{slug}/content.json`,
    '',
    'How to join records:',
    `- ${data.relations.join.projectToImpact}`,
    `- ${data.relations.join.impactToProject}`,
    `- ${data.relations.join.projectToExperience}`,
    `- ${data.relations.join.experienceToProjects}`,
    '',
    'Assessment shortcut:',
    '- Read `.assessmentIndex`, `.verifiedImpact`, and `.indexes` in content.json',
    '',
    'Shipped work (including non-case-study deliverables):',
    '- Read `.shippedWork` in content.json',
    '',
    'Related product (Seb Sans typeface / agent install):',
    ...site.relatedProducts.map(
      (p) => `- ${p.name}: ${p.url} · ${p.installManifest}`,
    ),
    '',
    `Contact: ${site.contactEmail}`,
    `Last updated: ${data.lastUpdated}`,
  ].join('\n');
}

export const AI_ROUTE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
} as const;

export const AI_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
} as const;
