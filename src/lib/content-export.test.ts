import assert from 'node:assert/strict';
import { test } from 'node:test';
import { VERIFIED_IMPACT } from '../data/profile';
import { toAgentGuideTxt, toLlmsTxt, toWhenToUseMarkdown } from './content-export';
import type { PortfolioExport } from './content-export';

function makeExport(): PortfolioExport {
  return {
    version: '3.0',
    generatedAt: '2026-08-21T00:00:00.000Z',
    lastUpdated: '2026-07-12',
    person: {
      name: 'Sebastian Mendo',
      publicTitle: 'Senior Product Designer',
      headline: 'Senior Product Designer leading 0-to-1 AI products.',
      aboutIntro: { title: "Hey, I'm Seb.", paragraphs: ['About copy.'] },
      executiveSummary: 'Sebastian Mendo is a Senior Product Designer at JPMorgan Chase.',
      positioningStatement: 'Specialized in agentic AI.',
      seniority: {
        level: 'Senior',
        title: 'Senior Product Designer',
        equivalentLevels: ['Senior', 'L5', 'IC5', 'P4'],
        scope: 'Owns 0-to-1 product areas.',
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
      domains: ['Agentic AI'],
      capabilities: ['0-to-1 product design'],
      tools: ['Figma'],
      staffLevelEvidence: ['Led Casey AI'],
    },
    site: {
      name: 'Sebastian Mendo',
      title: 'Sebastian Mendo | Senior Product Designer',
      description: 'Portfolio',
      url: 'https://www.sebmendo.design',
      contactEmail: 'contact@sebastianmendo.design',
      bio: 'Bio',
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
    experience: [],
    projects: [
      {
        slug: 'casey-ai',
        title: 'Chase Digital Assistant',
        tags: [],
        url: 'https://www.sebmendo.design/work/casey-ai',
        sections: [],
      },
    ],
    shippedWork: [],
    assessmentIndex: {
      level: 'Senior Product Designer',
      seniority: 'Senior',
      equivalentLevels: ['Senior', 'L5'],
      scope: 'Owns 0-to-1 product areas.',
      yearsOfExperience: 6,
      evidenceUrls: [],
      topProofPoints: [],
    },
  };
}

test('llms.txt includes a specific when-to-use section', () => {
  const text = toLlmsTxt(makeExport());
  assert.match(text, /## When to use this/);
  assert.match(text, /Hiring and leveling/);
  assert.match(text, /Do not infer seniority from adjectives/);
  assert.match(text, /Accept: text\/markdown/);
  assert.match(text, /Seb Sans install/);
  assert.doesNotMatch(text, /world-class digital experiences/i);
});

test('agent guide repeats when-to-use guidance', () => {
  const text = toAgentGuideTxt(makeExport());
  assert.match(text, /## When to use this/);
  assert.match(text, /How to call this site/);
  assert.match(text, /content\.json/);
});

test('when-to-use copy names concrete jobs and call paths', () => {
  const text = toWhenToUseMarkdown(makeExport());
  assert.match(text, /Chase Digital Assistant/);
  assert.match(text, /\/work\/\{slug\}/);
  assert.match(text, /verifiedImpact/);
  assert.match(text, /contact@sebastianmendo\.design/);
});
