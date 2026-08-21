import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  MARKDOWN_VARY,
  appendVaryAccept,
  isMarkdownNegotiablePath,
  isRscNavigationRequest,
  markdownRewritePath,
  preferredType,
  prefersMarkdown,
} from './accept-markdown';

test('prefers markdown when it is listed first', () => {
  assert.equal(preferredType('text/markdown, text/html;q=0.8'), 'text/markdown');
  assert.equal(prefersMarkdown('text/markdown'), true);
});

test('prefers html when it has a higher q-value', () => {
  assert.equal(preferredType('text/markdown;q=0.2, text/html'), 'text/html');
  assert.equal(prefersMarkdown('text/html,application/xhtml+xml'), false);
});

test('defaults to html when Accept is missing or */*', () => {
  assert.equal(preferredType(null), 'text/html');
  assert.equal(preferredType('*/*'), 'text/html');
});

test('returns null when every produced type is rejected', () => {
  assert.equal(preferredType('application/pdf'), null);
  assert.equal(preferredType('text/html;q=0, text/markdown;q=0, */*;q=0'), null);
});

test('specific ranges beat wildcards even with a lower q', () => {
  assert.equal(preferredType('text/html;q=0, */*;q=1'), 'text/markdown');
});

test('markdown Vary lists Accept and Accept-Encoding', () => {
  assert.equal(MARKDOWN_VARY, 'Accept, Accept-Encoding');
});

test('appendVaryAccept adds Accept and Accept-Encoding without duplicating', () => {
  const headers = new Headers({ Vary: 'rsc, next-router-state-tree' });
  appendVaryAccept(headers);
  appendVaryAccept(headers);
  const tokens = (headers.get('Vary') ?? '').split(',').map((s) => s.trim().toLowerCase());
  assert.ok(tokens.includes('accept'));
  assert.ok(tokens.includes('accept-encoding'));
  assert.equal(tokens.filter((token) => token === 'accept').length, 1);
});

test('markdown rewrite maps pages and .md siblings to the handler', () => {
  assert.equal(markdownRewritePath('/'), '/api/markdown');
  assert.equal(markdownRewritePath('/about'), '/api/markdown/about');
  assert.equal(markdownRewritePath('/work/casey-ai.md'), '/api/markdown/work/casey-ai');
});

test('skips negotiation for admin, login, api, and assets', () => {
  assert.equal(isMarkdownNegotiablePath('/about'), true);
  assert.equal(isMarkdownNegotiablePath('/admin/login'), false);
  assert.equal(isMarkdownNegotiablePath('/login'), false);
  assert.equal(isMarkdownNegotiablePath('/api/markdown/about'), false);
  assert.equal(isMarkdownNegotiablePath('/assets/nav.png'), false);
});

test('detects Next.js RSC navigations so they are not 406ed', () => {
  assert.equal(isRscNavigationRequest(new Headers({ rsc: '1' })), true);
  assert.equal(
    isRscNavigationRequest(new Headers({ accept: 'text/x-component' })),
    true,
  );
  assert.equal(isRscNavigationRequest(new Headers({ accept: 'text/html' })), false);
});
