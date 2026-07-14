import type { Project } from '@/data/projects';
import { cacheLife, cacheTag } from 'next/cache';
import {
  PROFILE,
  PROFILE_LAST_UPDATED,
  PROFILE_ROLES,
  VERIFIED_IMPACT,
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
  sections: ExportedSection[];
  impact?: ExportedImpact[];
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

export type PortfolioExport = {
  version: string;
  generatedAt: string;
  lastUpdated: string;
  person: {
    name: string;
    publicTitle: string;
    headline: string;
    executiveSummary: string;
    domains: string[];
    capabilities: string[];
    staffLevelEvidence: string[];
  };
  site: {
    name: string;
    title: string;
    description: string;
    url: string;
    contactEmail: string;
    bio: string;
  };
  verifiedImpact: typeof VERIFIED_IMPACT;
  experience: ExportedExperience[];
  projects: ExportedProject[];
  assessmentIndex: {
    level: string;
    evidenceUrls: string[];
    topProofPoints: { claim: string; evidence: string; metrics?: string[] }[];
  };
};

const EXPORT_VERSION = '2.0';

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
    sections: projectSections(project),
    impact: projectImpact(project),
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
      executiveSummary: PROFILE.executiveSummary,
      domains: [...PROFILE.domains],
      capabilities: [...PROFILE.capabilities],
      staffLevelEvidence: [...PROFILE.staffLevelEvidence],
    },
    site: {
      name: SITE_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: baseUrl,
      contactEmail: SITE_CONTACT_EMAIL,
      bio: WORK_PAGE_BIO,
    },
    verifiedImpact: VERIFIED_IMPACT,
    experience: PROFILE_ROLES.map(exportExperience),
    projects: projects.map((p) => exportProject(p, baseUrl)),
    assessmentIndex: {
      level: 'Senior Product Designer (L5/L6 scope)',
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

  return lines.join('\n').trim();
}

export function toLlmsTxt(data: PortfolioExport): string {
  const { site, person } = data;
  const lines = [
    `# ${person.name}`,
    '',
    `> ${person.executiveSummary}`,
    '',
    '## Identity',
    `- Title: ${person.publicTitle}`,
    `- Focus: ${person.domains.join(', ')}`,
    `- Contact: ${site.contactEmail}`,
    '',
    '## How to evaluate',
    'Read `/content.json` for structured profile and project data. Use `/llms-full.txt` for the complete narrative corpus.',
    '',
    '## Verified impact',
  ];

  for (const item of data.verifiedImpact) {
    const link = item.projectSlug
      ? `${site.url}/work/${item.projectSlug}`
      : `${site.url}/about`;
    lines.push(`- ${item.value} (${item.context}) — ${link}`);
  }

  lines.push('', '## Pages', `- [Work](${site.url}/): Project grid and bio.`, `- [About](${site.url}/about): Full experience and contact.`, '', '## Case studies');

  for (const project of data.projects) {
    lines.push(`- [${project.title}](${project.url}): ${projectSummary(project)}`);
  }

  lines.push(
    '',
    '## Machine-readable',
    `- [Full corpus](${site.url}/llms-full.txt): Complete portfolio text.`,
    `- [Structured JSON](${site.url}/content.json): Profile, experience, and project data (v${data.version}).`,
  );

  return lines.join('\n');
}

export function toLlmsFullTxt(data: PortfolioExport): string {
  const parts = [toLlmsTxt(data), '', '---', '', '# Full portfolio content', ''];

  parts.push('## About', '', data.person.executiveSummary, '');

  parts.push('## Capabilities', '');
  for (const cap of data.person.capabilities) {
    parts.push(`- ${cap}`);
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

  for (const project of data.projects) {
    parts.push(toProjectMarkdown(project), '', '---', '');
  }

  return parts.join('\n').trim();
}

export function toContentJson(data: PortfolioExport): string {
  return JSON.stringify(data, null, 2);
}

export const AI_ROUTE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
} as const;
