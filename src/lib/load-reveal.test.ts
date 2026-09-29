import assert from 'node:assert/strict';
import { test } from 'node:test';
import { feedRevealSlot, FIRST_FEED_SLOT, LAST_FEED_SLOT, revealSlot } from './load-reveal';

test('Feed reveal staggers the first cards then holds on the last slot', () => {
  assert.equal(feedRevealSlot(0), FIRST_FEED_SLOT);
  assert.equal(feedRevealSlot(1), FIRST_FEED_SLOT + 1);
  assert.equal(feedRevealSlot(2), LAST_FEED_SLOT);
  assert.equal(feedRevealSlot(12), LAST_FEED_SLOT);
  assert.equal(feedRevealSlot(Infinity), LAST_FEED_SLOT);
});

test('Reveal slot is exposed as a CSS custom property', () => {
  assert.deepEqual(revealSlot(3), { '--reveal-slot': 3 });
});
