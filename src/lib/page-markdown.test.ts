import assert from 'node:assert/strict';
import { test } from 'node:test';
import { projects } from '../data/projects';
import { assemblePortfolioExport } from './content-export';
import {
  MIN_HOME_CORPUS_CHARS,
  buildHomeCorpus,
  homeCorpusPlainText,
  normalizeMarkdownPath,
  resolvePageMarkdown,
  toNotFoundMarkdown,
} from './page-markdown';

function makeExport() {
  return assemblePortfolioExport(
    projects,
    'https://www.sebmendo.design',
    '2026-08-21T00:00:00.000Z',
  );
}

test('homepage corpus includes an H1 title and 500+ characters of text', () => {
  const corpus = buildHomeCorpus(makeExport());
  const text = homeCorpusPlainText(corpus);
  assert.match(corpus.title, /Sebastian Mendo/);
  assert.ok(text.length >= MIN_HOME_CORPUS_CHARS, `expected >= 500 chars, got ${text.length}`);
  assert.match(text, /When to use this/);
  assert.match(text, /Casey/);
  assert.match(text, /\[casey-production\]/);
  assert.match(text, /\[casey-ai\]/);
});

test('404 markdown points agents at sitemap, llms.txt, and docs index', () => {
  const body = toNotFoundMarkdown('https://www.sebmendo.design', '/missing-path');
  assert.match(body, /^# Page not found/m);
  assert.match(body, /\/missing-path/);
  assert.match(body, /sitemap\.xml/);
  assert.match(body, /llms\.txt/);
  assert.match(body, /content\.json/);
  assert.match(body, /impact\.json/);
  assert.match(body, /\/contact/);
  assert.match(body, /\/privacy/);
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

  const impact = resolvePageMarkdown('/impact.json', data);
  assert.equal(impact.status, 200);
  assert.match(impact.body, /casey-production/);

  const work = resolvePageMarkdown('/work/casey-ai', data);
  assert.equal(work.status, 200);
  assert.match(work.body, /Chase Digital Assistant/);
  assert.match(work.body, /\[casey-production\]/);

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
