import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groupPortfolioIndex } from './portfolio-index';
import { buildIndexStreamPlan } from './index-stream';
import { SITE_SOCIAL_NAV } from './site';
import {
  countWords,
  streamDurationMs,
  streamWordDelay,
  WORD_ANIMATION_MS,
  WORD_INTERVAL_MS,
} from './streaming-text';

/** Every streamed label in the rail, in the order it should appear. */
function railLabels(): string[] {
  const labels: string[] = [];

  for (const section of groupPortfolioIndex()) {
    labels.push(section.id);
    for (const group of section.years) {
      labels.push(String(group.year));
      for (const item of group.items) labels.push(item.label);
    }
  }

  return labels;
}

test('the headline and bio anchor the page and paint immediately', () => {
  const plan = buildIndexStreamPlan();

  assert.equal(plan.headline, 0);
  assert.equal(plan.bio, 0);
  assert.equal(plan.wellFadeMs, 0);
  assert.equal(plan.intervalMs, WORD_INTERVAL_MS);
  assert.deepEqual(
    plan.bioParts,
    plan.bioParts.map(() => 0),
  );
});

test('the rail is one contiguous stream, with no line waiting on the line above', () => {
  const plan = buildIndexStreamPlan();

  let expected = 0;
  for (const section of groupPortfolioIndex()) {
    assert.equal(plan.headings[section.id], expected, `${section.id} left a gap`);
    expected += countWords(section.id);

    for (const group of section.years) {
      const yearKey = `${section.id}-${group.year}`;
      assert.equal(plan.years[yearKey], expected, `${yearKey} left a gap`);
      expected += countWords(String(group.year));

      for (const item of group.items) {
        assert.equal(plan.items[item.id], expected, `${item.id} left a gap`);
        expected += countWords(item.label);
      }
    }
  }

  // The footer continues the same run rather than starting a new one.
  assert.equal(plan.footer.about, expected);
});

test('offsets stay inside the declared total', () => {
  const plan = buildIndexStreamPlan();
  const offsets = [
    ...Object.values(plan.headings),
    ...Object.values(plan.years),
    ...Object.values(plan.items),
    ...Object.values(plan.footer),
  ];

  assert.ok(offsets.length > 0);
  for (const offset of offsets) {
    assert.ok(offset >= 0 && offset < plan.totalWords, `offset ${offset} out of range`);
  }
  const streamed = [
    ...railLabels(),
    'about',
    ...SITE_SOCIAL_NAV.map((link) => link.label),
  ];
  assert.equal(
    plan.totalWords,
    streamed.reduce((count, label) => count + countWords(label), 0),
  );
});

test('the whole rail lands fast, and stays fast as projects are added', () => {
  const plan = buildIndexStreamPlan();

  assert.equal(plan.durationMs, streamDurationMs(plan.totalWords));
  assert.ok(
    plan.durationMs < 2000,
    `rail takes ${plan.durationMs}ms to paint, which reads as a crawl`,
  );

  // The theme toggle rides the last word rather than trailing behind it.
  assert.equal(plan.themeMs, streamWordDelay(plan.totalWords - 1, plan.totalWords));
  assert.ok(plan.themeMs <= plan.durationMs - WORD_ANIMATION_MS);
});
