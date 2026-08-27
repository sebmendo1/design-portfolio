import assert from 'node:assert/strict';
import { test } from 'node:test';
import { VERIFIED_IMPACT } from '../data/profile';
import { projects } from '../data/projects';
import {
  assemblePortfolioExport,
  listPortfolioJoinIssues,
  toAgentGuideTxt,
  toImpactJson,
  toImpactMarkdown,
  toLlmsTxt,
  toProjectMarkdown,
  toWhenToUseMarkdown,
} from './content-export';

const SITE = 'https://www.sebmendo.design';

function makeExport() {
  return assemblePortfolioExport(projects, SITE, '2026-08-21T00:00:00.000Z');
}

test('llms.txt includes a specific when-to-use section', () => {
  const text = toLlmsTxt(makeExport());
  assert.match(text, /## When to use this/);
  assert.match(text, /Hiring and leveling/);
  assert.match(text, /\/contact/);
  assert.match(text, /\/privacy/);
  assert.match(text, /Do not infer seniority from adjectives/);
  assert.match(text, /Accept: text\/markdown/);
  assert.match(text, /Seb Sans install/);
  assert.doesNotMatch(text, /world-class digital experiences/i);
});

test('agent guide repeats when-to-use guidance and join keys', () => {
  const text = toAgentGuideTxt(makeExport());
  assert.match(text, /## When to use this/);
  assert.match(text, /How to call this site/);
  assert.match(text, /content\.json/);
  assert.match(text, /impact\.json/);
  assert.match(text, /projects\[\]\.impactIds/);
});

test('when-to-use copy names concrete jobs and call paths', () => {
  const text = toWhenToUseMarkdown(makeExport());
  assert.match(text, /Chase Digital Assistant/);
  assert.match(text, /\/work\/\{slug\}/);
  assert.match(text, /verifiedImpact/);
  assert.match(text, /impact\.json/);
  assert.match(text, /contact@sebastianmendo\.design/);
});

test('assembled export joins every project, impact, role, and shipped-work row', () => {
  const data = makeExport();
  assert.equal(data.version, '4.0');
  assert.deepEqual(listPortfolioJoinIssues(data), []);
  assert.equal(data.verifiedImpact.length, VERIFIED_IMPACT.length);
  assert.ok(data.projects.every((project) => project.htmlUrl && project.jsonUrl));
  assert.ok(data.verifiedImpact.every((item) => item.id && item.evidenceUrl));
});

test('project markdown cites impact IDs and empty-impact projects stay explicit', () => {
  const data = makeExport();
  const casey = data.projects.find((project) => project.slug === 'casey-ai');
  const memento = data.projects.find((project) => project.slug === 'memento-ai');
  assert.ok(casey && memento);

  const caseyMd = toProjectMarkdown(casey);
  assert.match(caseyMd, /slug: `casey-ai`/);
  assert.match(caseyMd, /\[casey-production\]/);
  assert.match(caseyMd, /confidence: measured/);
  assert.match(caseyMd, /content\.json/);

  const mementoMd = toProjectMarkdown(memento);
  assert.match(mementoMd, /impactIds: none/);
  assert.match(mementoMd, /Do not invent numbers/);
});

test('impact.json feed is citeable by id and lists projects without metrics', () => {
  const data = makeExport();
  const json = JSON.parse(toImpactJson(data)) as {
    citationRule: string;
    impact: Array<{ id: string; projectSlug?: string }>;
    indexes: { projectsWithoutVerifiedImpact: string[] };
  };
  assert.match(json.citationRule, /Cite the impact id/);
  assert.ok(json.impact.some((item) => item.id === 'casey-production'));
  assert.ok(json.indexes.projectsWithoutVerifiedImpact.includes('memento-ai'));

  const markdown = toImpactMarkdown(data);
  assert.match(markdown, /# Verified impact/);
  assert.match(markdown, /### `casey-production`/);
  assert.match(markdown, /Projects without verified impact/);
});
