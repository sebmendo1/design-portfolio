import { getLlmsTxt } from '@/lib/seb-sans/agent-manifest';
import { CONTACT_PAGE, PRIVACY_PAGE, trustPageMarkdown } from '@/lib/trust-pages';
import {
  getWhenToUseHowToCall,
  getWhenToUseJobs,
  projectSummary,
  toAgentGuideTxt,
  toLlmsFullTxt,
  toLlmsTxt,
  toProjectMarkdown,
  toWhenToUseMarkdown,
  type ExportedProject,
  type PortfolioExport,
} from '@/lib/content-export';

/** Auditors require 500+ characters of raw homepage text. */
export const MIN_HOME_CORPUS_CHARS = 500;

export type HomeCorpusSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  items?: string[];
};

export type HomeCorpus = {
  title: string;
  lede: string;
  paragraphs: string[];
  sections: HomeCorpusSection[];
};

export function normalizeMarkdownPath(pathname: string): string {
  let path = pathname.split('?')[0] ?? '/';
  if (path.endsWith('.md')) path = path.slice(0, -3) || '/';
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  if (!path.startsWith('/')) path = `/${path}`;
  return path || '/';
}

export function toNotFoundMarkdown(siteUrl: string, path = '/unknown'): string {
  const base = siteUrl.replace(/\/$/, '');
  return [
    '# Page not found',
    '',
    `The path \`${path}\` does not exist on this site.`,
    '',
    '## Where to look next',
    '',
    `- [Sitemap](${base}/sitemap.xml) — every public URL`,
    `- [llms.txt](${base}/llms.txt) — agent index, when-to-use guidance, and case-study links`,
    `- [Full corpus](${base}/llms-full.txt) — complete portfolio narrative`,
    `- [Structured JSON](${base}/content.json) — profile, experience, impact, and projects`,
    `- [Agent guide](${base}/.well-known/ai.txt) — discovery entrypoint`,
    `- [Work](${base}/) — project grid`,
    `- [About](${base}/about) — experience and contact`,
    `- [Contact](${base}/contact) — how to reach this practice`,
    `- [Privacy](${base}/privacy) — what this site collects`,
    `- [Seb Sans](${base}/seb-sans/llms.txt) — typeface install for coding agents`,
    '',
    'Retry the same URL with `Accept: text/markdown` on a real page, or start at `llms.txt`.',
    '',
  ].join('\n');
}

export function buildHomeCorpus(data: PortfolioExport): HomeCorpus {
  const { person, site } = data;
  const level = `${person.seniority.title} (${person.seniority.equivalentLevels.join(' / ')})`;

  return {
    title: `${person.name} | ${person.publicTitle}`,
    lede: person.executiveSummary,
    paragraphs: [
      person.positioningStatement,
      ...person.aboutIntro.paragraphs,
    ],
    sections: [
      {
        id: 'when-to-use',
        heading: 'When to use this',
        paragraphs: [
          'Use this site when the job is one of the following. Skip it for general design-system, illustration, or brand-identity research — those are not what this portfolio is for.',
        ],
        items: [
          ...getWhenToUseJobs(data).map((job) => `${job.title} — ${job.body}`),
          ...getWhenToUseHowToCall(data),
        ],
      },
      {
        id: 'identity',
        heading: 'Identity',
        items: [
          `Title: ${person.publicTitle}`,
          `Level: ${level}`,
          `Experience: ${person.seniority.yearsOfExperience}+ years since ${person.seniority.careerStartDate}`,
          `Scope: ${person.seniority.scope}`,
          `Focus: ${person.domains.join(', ')}`,
          `Contact: ${site.contactEmail}`,
        ],
      },
      {
        id: 'experience',
        heading: 'Experience',
        items: data.experience.map((role) => {
          const suffix = role.current ? ' — current' : '';
          return `${role.role} — ${role.company} (${role.period})${suffix}. ${role.summary}`;
        }),
      },
      {
        id: 'impact',
        heading: 'Verified impact',
        items: data.verifiedImpact.map((item) => {
          const link = item.projectSlug
            ? `${site.url}/work/${item.projectSlug}`
            : `${site.url}/about`;
          return `${item.metric}: ${item.value} (${item.context}) — ${link}`;
        }),
      },
      {
        id: 'work',
        heading: 'Case studies',
        items: data.projects.map((project) => {
          return `${project.title} — ${projectSummary(project)} ${project.url}`;
        }),
      },
      {
        id: 'shipped',
        heading: 'Shipped work',
        items: data.shippedWork.map((item) => {
          const link = item.url ? ` — ${item.url}` : '';
          const pending = item.pending ? ' (pending)' : '';
          return `${item.title} · ${item.affiliation} · ${item.dateLabel}${pending}${link}`;
        }),
      },
      {
        id: 'machine-readable',
        heading: 'Machine-readable',
        items: [
          `Agent guide: ${site.machineReadable.agentGuide}`,
          `LLM index: ${site.machineReadable.index}`,
          `Full corpus: ${site.machineReadable.corpus}`,
          `Structured JSON: ${site.machineReadable.json}`,
        ],
      },
    ],
  };
}

export function homeCorpusPlainText(corpus: HomeCorpus): string {
  const parts = [corpus.title, corpus.lede, ...corpus.paragraphs];
  for (const section of corpus.sections) {
    parts.push(section.heading);
    if (section.paragraphs) parts.push(...section.paragraphs);
    if (section.items) parts.push(...section.items);
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

export function homeCorpusMarkdown(corpus: HomeCorpus): string {
  const lines = [`# ${corpus.title}`, '', corpus.lede, '', ...corpus.paragraphs, ''];
  for (const section of corpus.sections) {
    lines.push(`## ${section.heading}`, '');
    if (section.paragraphs) {
      for (const paragraph of section.paragraphs) {
        lines.push(paragraph, '');
      }
    }
    if (section.items) {
      for (const item of section.items) {
        lines.push(`- ${item}`);
      }
      lines.push('');
    }
  }
  return lines.join('\n').trim() + '\n';
}

export function toHomeMarkdown(data: PortfolioExport): string {
  return homeCorpusMarkdown(buildHomeCorpus(data));
}

export function toAboutMarkdown(data: PortfolioExport): string {
  const { person, site } = data;
  const lines = [
    `# About ${person.name}`,
    '',
    `## ${person.aboutIntro.title}`,
    '',
    ...person.aboutIntro.paragraphs.flatMap((paragraph) => [paragraph, '']),
    person.executiveSummary,
    '',
    '## Experience',
    '',
  ];

  for (const role of data.experience) {
    lines.push(`### ${role.role} — ${role.company} (${role.period})`, '', role.summary, '');
    if (role.outcomes.length) {
      lines.push('Outcomes:');
      for (const outcome of role.outcomes) {
        lines.push(`- ${outcome}`);
      }
      lines.push('');
    }
  }

  lines.push(
    '## Contact',
    '',
    `- Email: ${site.contactEmail}`,
    `- Work: ${site.url}/`,
    `- Structured JSON: ${site.machineReadable.json}`,
    '',
    toWhenToUseMarkdown(data),
    '',
  );

  return lines.join('\n');
}

export function toWorkPageMarkdown(data: PortfolioExport, project: ExportedProject): string {
  return [
    toProjectMarkdown(project),
    '',
    `Canonical URL: ${project.url}`,
    `Structured JSON: ${data.site.url}/work/${project.slug}/content.json`,
    '',
    toWhenToUseMarkdown(data),
    '',
  ].join('\n');
}

export type MarkdownPageResult = {
  status: number;
  body: string;
};

export function resolvePageMarkdown(
  pathname: string,
  data: PortfolioExport,
): MarkdownPageResult {
  const path = normalizeMarkdownPath(pathname);

  if (path === '/') return { status: 200, body: toHomeMarkdown(data) };
  if (path === '/about') return { status: 200, body: toAboutMarkdown(data) };
  if (path === '/contact') return { status: 200, body: trustPageMarkdown(CONTACT_PAGE) };
  if (path === '/privacy') return { status: 200, body: trustPageMarkdown(PRIVACY_PAGE) };
  if (path === '/seb-sans') return { status: 200, body: getLlmsTxt() };
  if (path === '/llms.txt') return { status: 200, body: toLlmsTxt(data) };
  if (path === '/llms-full.txt') return { status: 200, body: toLlmsFullTxt(data) };
  if (path === '/.well-known/ai.txt') return { status: 200, body: toAgentGuideTxt(data) };

  const workMatch = path.match(/^\/work\/([^/]+)$/);
  if (workMatch) {
    const slug = workMatch[1];
    const project = data.projects.find((item) => item.slug === slug);
    if (project) return { status: 200, body: toWorkPageMarkdown(data, project) };
  }

  return { status: 404, body: toNotFoundMarkdown(data.site.url, path) };
}
