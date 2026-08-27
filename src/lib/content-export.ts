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
  metric: string;
  value: string;
  context: string;
  confidence: ClaimConfidence;
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
  /** Links this case study back to the experience entry that produced it. */
  experienceRoleId?: string;
  sections: ExportedSection[];
  impact?: ExportedImpact[];
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
  relatedProjectSlugs?: string[];
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
      agentGuide: string;
    };
    relatedProducts: {
      name: string;
      url: string;
      installManifest: string;
      llmsTxt: string;
    }[];
  };
  verifiedImpact: typeof VERIFIED_IMPACT;
  experience: ExportedExperience[];
  projects: ExportedProject[];
  shippedWork: ExportedShippedWork[];
  assessmentIndex: {
    level: string;
    seniority: string;
    equivalentLevels: string[];
    scope: string;
    yearsOfExperience: number;
    evidenceUrls: string[];
    topProofPoints: { claim: string; evidence: string; metrics?: string[] }[];
  };
};

/** Export schema — bump when adding/removing top-level fields. */
const EXPORT_VERSION = '3.0';

function absoluteUrl(baseUrl: string, path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function exportExperience(role: ProfileRole): ExportedExperience {
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
    relatedProjectSlugs: role.relatedProjectSlugs,
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

function projectImpact(project: Project): ExportedImpact[] | undefined {
  const verified = VERIFIED_IMPACT.filter((item) => item.projectSlug === project.slug);
  if (!verified.length) return undefined;

  return verified.map((item) => ({
    metric: item.metric,
    value: item.value,
    context: item.context,
    confidence: item.confidence,
  }));
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
  return {
    slug: project.slug,
    title: project.title,
    tagline: project.tagline,
    description: project.description,
    company: project.company,
    role: project.role,
    year: project.year,
    tags: project.tags ?? [],
    url: `${baseUrl}/work/${project.slug}`,
    experienceRoleId: getRoleIdForProjectSlug(project.slug),
    sections: projectSections(project),
    impact: projectImpact(project),
    media: projectMedia(project, baseUrl),
  };
}

export function exportMergedProject(project: Project): ExportedProject {
  return exportProject(project, getSiteUrl());
}

export async function buildPortfolioExport(): Promise<PortfolioExport> {
  'use cache';
  cacheLife('hours');
  cacheTag(CMS_PROJECTS_TAG, 'portfolio-export');

  const baseUrl = getSiteUrl();
  const projects = await getCachedMergedProjects();
  const currentRole = getCurrentRole();

  const topProofPoints = VERIFIED_IMPACT.map((item) => ({
    claim: `${item.metric}: ${item.value}`,
    evidence: item.projectSlug ? `${baseUrl}/work/${item.projectSlug}` : `${baseUrl}/about`,
    metrics: [item.value],
  }));

  return {
    version: EXPORT_VERSION,
    generatedAt: new Date().toISOString(),
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
    verifiedImpact: VERIFIED_IMPACT,
    experience: PROFILE_ROLES.map(exportExperience),
    projects: projects.map((p) => exportProject(p, baseUrl)),
    shippedWork: [...SHIPPED_WORK]
      .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
      .map((entry) => exportShippedWork(entry, baseUrl)),
    assessmentIndex: {
      level: `${PROFILE_LEVEL.title} (${PROFILE_LEVEL.equivalentLevels.join(' / ')})`,
      seniority: PROFILE_LEVEL.seniority,
      equivalentLevels: [...PROFILE_LEVEL.equivalentLevels],
      scope: PROFILE_LEVEL.scope,
      yearsOfExperience: getYearsOfExperience(),
      evidenceUrls: [
        `${baseUrl}/about`,
        ...projects
          .filter((p) => VERIFIED_IMPACT.some((v) => v.projectSlug === p.slug))
          .map((p) => `${baseUrl}/work/${p.slug}`),
      ],
      topProofPoints,
    },
  };
}

export function projectSummary(project: ExportedProject): string {
  return project.description ?? project.tagline ?? project.title;
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

  const lines = [`## ${project.title}`, '', meta, ''];

  if (project.impact?.length) {
    lines.push('### Impact', '');
    for (const item of project.impact) {
      lines.push(`- **${item.metric}**: ${item.value} (${item.context})`);
    }
    lines.push('');
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
      body: `Quote only metrics listed in .verifiedImpact (confidence is verified, measured, pilot, or qualitative). If a number is not in that list, do not invent it.`,
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
    `Index: GET ${site.machineReadable.index}`,
    `Full prose: GET ${site.machineReadable.corpus}`,
    'Same-URL markdown: send Accept: text/markdown to /, /about, or /work/{slug}',
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
    'Start at `/.well-known/ai.txt` for discovery. Prefer `/content.json` for structured data and `/llms-full.txt` for the complete narrative corpus. Per-project JSON is available at `/work/{slug}/content.json`.',
    '',
    '## Experience',
  ];

  for (const role of data.experience) {
    lines.push(`- ${role.role} — ${role.company} (${role.period})${role.current ? ' — current' : ''}`);
  }

  lines.push('', '## Verified impact');

  for (const item of data.verifiedImpact) {
    const link = item.projectSlug
      ? `${site.url}/work/${item.projectSlug}`
      : `${site.url}/about`;
    lines.push(`- ${item.value} (${item.context}) — ${link}`);
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
    '',
    '## Case studies',
  );

  for (const project of data.projects) {
    lines.push(`- [${project.title}](${project.url}): ${projectSummary(project)}`);
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

export function toAgentGuideTxt(data: PortfolioExport): string {
  const { site, person } = data;
  return [
    `# Agent guide — ${person.name}`,
    '',
    toWhenToUseMarkdown(data),
    '',
    'Preferred structured source:',
    `- ${site.machineReadable.json} (application/json, v${data.version})`,
    '',
    'Plain-text index and corpus:',
    `- ${site.machineReadable.index}`,
    `- ${site.machineReadable.corpus}`,
    '',
    'Per-project JSON:',
    `- ${site.url}/work/{slug}/content.json`,
    '',
    'Assessment shortcut:',
    '- Read `.assessmentIndex` and `.verifiedImpact` in content.json',
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
