import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PROFILE } from '../data/profile';
import {
  ABOUT_INTRO_BLOCKS,
  buildAboutStreamPlan,
  splitAboutText,
} from './about-stream';
import { SITE_SOCIAL_NAV } from './site';
import { countWords, streamDurationMs, WORD_INTERVAL_MS } from './streaming-text';

test('About stream reconstructs the intro and keeps company links', () => {
  const title = ABOUT_INTRO_BLOCKS[0];
  assert.equal(title.parts.map((part) => part.text).join(''), PROFILE.aboutIntro.title);

  PROFILE.aboutIntro.paragraphs.forEach((paragraph, index) => {
    const block = ABOUT_INTRO_BLOCKS[index + 1];
    assert.ok(block);
    assert.equal(block.parts.map((part) => part.text).join(''), paragraph);
    assert.doesNotMatch(paragraph, /\u2014|\u2013/);
  });

  const chase = splitAboutText('Designer at JPMorgan Chase working');
  assert.deepEqual(
    chase.map((part) => part.type),
    ['text', 'link', 'text'],
  );
  assert.equal(chase[1]?.type === 'link' ? chase[1].href : '', 'https://www.chase.com');
  assert.equal(chase[2]?.text.startsWith(' '), true);
});

test('the headline and title anchor the page and paint immediately', () => {
  const plan = buildAboutStreamPlan();

  assert.equal(plan.headline, 0);
  assert.equal(plan.intervalMs, WORD_INTERVAL_MS);
  assert.deepEqual(plan.blocks[0], ABOUT_INTRO_BLOCKS[0].parts.map(() => 0));
});

test('paragraphs and footer ride one contiguous stream', () => {
  const plan = buildAboutStreamPlan();

  let expected = 0;
  ABOUT_INTRO_BLOCKS.forEach((block, blockIndex) => {
    if (block.key === 'title') return;

    block.parts.forEach((part, partIndex) => {
      assert.equal(
        plan.blocks[blockIndex]?.[partIndex],
        expected,
        `${block.key} part ${partIndex} left a gap`,
      );
      expected += countWords(part.text);
    });
  });

  assert.equal(plan.footer.work, expected, 'footer restarted instead of continuing');
  expected += countWords('work');

  for (const link of SITE_SOCIAL_NAV) {
    assert.equal(plan.footer[link.label], expected, `${link.label} left a gap`);
    expected += countWords(link.label);
  }

  assert.equal(plan.totalWords, expected);
});

test('the About rail lands fast', () => {
  const plan = buildAboutStreamPlan();

  assert.equal(plan.durationMs, streamDurationMs(plan.totalWords));
  assert.ok(
    plan.durationMs < 2000,
    `About rail takes ${plan.durationMs}ms to paint, which reads as a crawl`,
  );
  assert.ok(plan.themeMs < plan.durationMs);
});
