import assert from 'node:assert/strict';
import { test } from 'node:test';
import { VERIFIED_IMPACT } from '../data/profile';
import type { PortfolioExport } from './content-export';
import {
  MIN_HOME_CORPUS_CHARS,
  buildHomeCorpus,
  homeCorpusPlainText,
  normalizeMarkdownPath,
  resolvePageMarkdown,
  toNotFoundMarkdown,
} from './page-markdown';

function makeExport(): PortfolioExport {
  return {
    version: '3.0',
    generatedAt: '2026-08-21T00:00:00.000Z',
    lastUpdated: '2026-07-12',
    person: {
      name: 'Sebastian Mendo',
      publicTitle: 'Senior Product Designer',
      headline: 'Senior Product Designer leading 0-to-1 AI products.',
      aboutIntro: {
        title: "Hey, I'm Seb.",
        paragraphs: [
          "I'm a Senior Product Designer at Chase working on Consumer AI.",
          'Previously I designed AI experiences at Salesforce, Writer AI, and Chorus AI.',
        ],
      },
      executiveSummary:
        'Sebastian Mendo is a Senior Product Designer at JPMorgan Chase, where he leads design for Casey AI—Chase\'s first customer-facing AI agent, shipped on voice and RCS and now the reference pattern for agentic work across the business. He previously shaped Chase MyHome onboarding and mortgage flows. Before banking, he designed AI-powered enterprise support at Salesforce and early GenAI content tools at WRITER.',
      positioningStatement:
        'Senior Product Designer specialized in agentic AI, voice and conversational UX, and shipping inside regulated environments.',
      seniority: {
        level: 'Senior',
        title: 'Senior Product Designer',
        equivalentLevels: ['Senior', 'L5', 'IC5', 'P4'],
        scope: 'Owns 0-to-1 product areas end to end and leads design for a flagship AI program.',
        managementTrack: false,
        yearsOfExperience: 6,
        monthsOfExperience: 80,
        careerStartDate: '2019-11',
        occupationalCategory: {
          code: '15-1255.00',
          name: 'Web and Digital Interface Designers',
          codeSet: 'O*NET-SOC',
        },
      },
      currentRole: {
        company: 'JPMorgan Chase',
        role: 'Senior Product Designer — AI',
        startDate: '2025-07',
      },
      domains: ['Agentic AI', 'Conversational UX', 'Voice AI'],
      capabilities: ['0-to-1 product design'],
      tools: ['Figma', 'Cursor'],
      staffLevelEvidence: ['Led design and launch of Casey AI'],
    },
    site: {
      name: 'Sebastian Mendo',
      title: 'Sebastian Mendo | Senior Product Designer',
      description: 'Portfolio of Sebastian Mendo',
      url: 'https://www.sebmendo.design',
      contactEmail: 'contact@sebastianmendo.design',
      bio: 'Sebastian is a Senior Product Designer building agentic banking experiences at Chase.',
      machineReadable: {
        index: 'https://www.sebmendo.design/llms.txt',
        corpus: 'https://www.sebmendo.design/llms-full.txt',
        json: 'https://www.sebmendo.design/content.json',
        agentGuide: 'https://www.sebmendo.design/.well-known/ai.txt',
      },
      relatedProducts: [
        {
          name: 'Seb Sans',
          url: 'https://www.sebmendo.design/seb-sans',
          installManifest: 'https://www.sebmendo.design/seb-sans/install.json',
          llmsTxt: 'https://www.sebmendo.design/seb-sans/llms.txt',
        },
      ],
    },
    verifiedImpact: VERIFIED_IMPACT,
    experience: [
      {
        id: 'jpmc-ai',
        company: 'JPMorgan Chase',
        role: 'Senior Product Designer — AI',
        period: 'Jul 2025 – Present',
        startDate: '2025-07',
        current: true,
        summary: 'Leads design for Casey AI, Chase\'s first customer-facing AI agent.',
        responsibilities: ['Design conversational AI flows'],
        outcomes: ['Casey AI shipped to production'],
        capabilities: ['Agentic AI'],
        relatedProjectSlugs: ['casey-ai'],
      },
    ],
    projects: [
      {
        slug: 'casey-ai',
        title: 'Chase Digital Assistant',
        tagline: 'Casey is Chase\'s first ever AI agent for engaging with customers through voice and RCS.',
        description: 'Casey is Chase\'s first ever AI agent for engaging with customers through voice and RCS.',
        company: 'JPMorgan Chase',
        role: 'Senior Product Designer',
        year: 2025,
        tags: ['AI', 'Voice'],
        url: 'https://www.sebmendo.design/work/casey-ai',
        experienceRoleId: 'jpmc-ai',
        sections: [
          {
            id: 'challenge',
            label: 'Challenge',
            headline: 'Home lending was the hardest room in the bank.',
            body: 'Casey had to work in a regulated environment with real customers.',
          },
        ],
        impact: [
          {
            metric: 'calls_initiated',
            value: '3,000+',
            context: 'Casey Voice production',
            confidence: 'measured',
          },
        ],
      },
    ],
    shippedWork: [
      {
        id: 'casey-voice',
        title: 'Conversational AI (Voice)',
        affiliation: 'Chase',
        dateLabel: 'July 2025',
        sortDate: '2025-07',
        projectSlug: 'casey-ai',
        url: 'https://www.sebmendo.design/work/casey-ai',
      },
    ],
    assessmentIndex: {
      level: 'Senior Product Designer (Senior / L5 / IC5 / P4)',
      seniority: 'Senior',
      equivalentLevels: ['Senior', 'L5', 'IC5', 'P4'],
      scope: 'Owns 0-to-1 product areas',
      yearsOfExperience: 6,
      evidenceUrls: ['https://www.sebmendo.design/about'],
      topProofPoints: [
        {
          claim: 'calls_initiated: 3,000+',
          evidence: 'https://www.sebmendo.design/work/casey-ai',
          metrics: ['3,000+'],
        },
      ],
    },
  };
}

test('homepage corpus includes an H1 title and 500+ characters of text', () => {
  const corpus = buildHomeCorpus(makeExport());
  const text = homeCorpusPlainText(corpus);
  assert.match(corpus.title, /Sebastian Mendo/);
  assert.ok(text.length >= MIN_HOME_CORPUS_CHARS, `expected >= 500 chars, got ${text.length}`);
  assert.match(text, /When to use this/);
  assert.match(text, /Casey/);
});

test('404 markdown points agents at sitemap, llms.txt, and docs index', () => {
  const body = toNotFoundMarkdown('https://www.sebmendo.design', '/missing-path');
  assert.match(body, /^# Page not found/m);
  assert.match(body, /\/missing-path/);
  assert.match(body, /sitemap\.xml/);
  assert.match(body, /llms\.txt/);
  assert.match(body, /content\.json/);
  assert.match(body, /\/.well-known\/ai\.txt/);
});

test('resolvePageMarkdown serves known pages and 404s unknown ones', () => {
  const data = makeExport();
  const home = resolvePageMarkdown('/', data);
  assert.equal(home.status, 200);
  assert.match(home.body, /^# Sebastian Mendo/m);
  assert.match(home.body, /When to use this/);

  const about = resolvePageMarkdown('/about.md', data);
  assert.equal(about.status, 200);
  assert.match(about.body, /Hey, I'm Seb/);

  const contact = resolvePageMarkdown('/contact', data);
  assert.equal(contact.status, 200);
  assert.match(contact.body, /contact@sebastianmendo\.design/);

  const privacy = resolvePageMarkdown('/privacy.md', data);
  assert.equal(privacy.status, 200);
  assert.match(privacy.body, /Vercel/);

  const work = resolvePageMarkdown('/work/casey-ai', data);
  assert.equal(work.status, 200);
  assert.match(work.body, /Chase Digital Assistant/);

  const missing = resolvePageMarkdown('/some-path-that-does-not-exist', data);
  assert.equal(missing.status, 404);
  assert.match(missing.body, /sitemap\.xml/);
  assert.match(missing.body, /llms\.txt/);
});

test('normalizeMarkdownPath strips .md and trailing slashes', () => {
  assert.equal(normalizeMarkdownPath('/about.md'), '/about');
  assert.equal(normalizeMarkdownPath('/work/casey-ai/'), '/work/casey-ai');
  assert.equal(normalizeMarkdownPath('about'), '/about');
});
