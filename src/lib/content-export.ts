import type { Project } from '@/data/projects';
import { workExperience } from '@/data/workExperience';
import { getMergedProjects } from '@/lib/cms-data';
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
};

export type ExportedExperience = {
  company: string;
  role: string;
  period: string;
  current: boolean;
};

export type PortfolioExport = {
  version: string;
  generatedAt: string;
  site: {
    name: string;
    title: string;
    description: string;
    url: string;
    contactEmail: string;
    bio: string;
  };
  experience: ExportedExperience[];
  projects: ExportedProject[];
};

const EXPORT_VERSION = '1.0';

function projectSections(project: Project): ExportedSection[] {
  const beats = project.scrollyConfig?.beats;
  if (beats?.length) {
    return beats.map((beat) => ({
      id: beat.id,
      label: beat.label,
      headline: beat.headline,
      body: beat.body,
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
  };
}

export function exportMergedProject(project: Project): ExportedProject {
  return exportProject(project, getSiteUrl());
}

export async function buildPortfolioExport(): Promise<PortfolioExport> {
  const baseUrl = getSiteUrl();
  const projects = await getMergedProjects();

  return {
    version: EXPORT_VERSION,
    generatedAt: new Date().toISOString(),
    site: {
      name: SITE_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: baseUrl,
      contactEmail: SITE_CONTACT_EMAIL,
      bio: WORK_PAGE_BIO,
    },
    experience: workExperience.map((exp) => ({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      current: exp.current,
    })),
    projects: projects.map((p) => exportProject(p, baseUrl)),
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
  const { site } = data;
  const lines = [
    `# ${site.title}`,
    '',
    `> ${site.bio}`,
    '',
    '## Pages',
    `- [Work](${site.url}/): Project grid and bio.`,
    `- [About](${site.url}/about): Experience and contact.`,
    '',
    '## Case studies',
  ];

  for (const project of data.projects) {
    lines.push(
      `- [${project.title}](${project.url}): ${projectSummary(project)}`,
    );
  }

  lines.push(
    '',
    '## Machine-readable',
    `- [Full corpus](${site.url}/llms-full.txt): Complete portfolio text in one file.`,
    `- [Structured JSON](${site.url}/content.json): Machine-parseable project data.`,
  );

  return lines.join('\n');
}

export function toLlmsFullTxt(data: PortfolioExport): string {
  const parts = [toLlmsTxt(data), '', '---', '', '# Full portfolio content', ''];

  parts.push('## About', '', data.site.bio, '');

  if (data.experience.length) {
    parts.push('## Experience', '');
    for (const exp of data.experience) {
      parts.push(`- **${exp.company}** — ${exp.role} (${exp.period})`);
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

export const AI_ROUTE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
} as const;
