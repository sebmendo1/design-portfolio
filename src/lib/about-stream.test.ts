import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PROFILE } from '../data/profile';
import {
  ABOUT_INTRO_BLOCKS,
  buildAboutStreamDelays,
  splitAboutText,
} from './about-stream';

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

test('About stream delays follow the headline, then copy, then footer', () => {
  const delays = buildAboutStreamDelays();

  assert.equal(delays.headline, 0);
  assert.equal(delays.intervalMs, 28);
  assert.ok(delays.blocks[0]?.[0] > delays.headline);
  assert.ok((delays.footer.work ?? 0) > (delays.blocks.at(-1)?.[0] ?? 0));
  assert.equal(delays.theme, delays.footer.work);
});
