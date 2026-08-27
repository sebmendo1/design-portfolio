import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CONTACT_PAGE,
  MIN_TRUST_PAGE_CHARS,
  PRIVACY_PAGE,
  trustPageMarkdown,
  trustPagePlainText,
} from './trust-pages';

test('contact and privacy pages have 500+ characters of real copy', () => {
  for (const page of [CONTACT_PAGE, PRIVACY_PAGE]) {
    const text = trustPagePlainText(page);
    assert.ok(
      text.length >= MIN_TRUST_PAGE_CHARS,
      `${page.slug} expected >= ${MIN_TRUST_PAGE_CHARS} chars, got ${text.length}`,
    );
    assert.match(trustPageMarkdown(page), new RegExp(`^# ${page.title}`, 'm'));
  }
});

test('contact names email and how to use it', () => {
  const text = trustPagePlainText(CONTACT_PAGE);
  assert.match(text, /contact@sebastianmendo\.design/);
  assert.match(text, /LinkedIn/);
  assert.doesNotMatch(text, /world-class digital experiences/i);
});

test('privacy describes hosting, analytics, and what is not collected', () => {
  const text = trustPagePlainText(PRIVACY_PAGE);
  assert.match(text, /Vercel/);
  assert.match(text, /Analytics/);
  assert.match(text, /No data is sold/);
});
