import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildIndexStreamDelays } from './index-stream';

test('index stream reveals the well after the bio and finishes near 5s', () => {
  const delays = buildIndexStreamDelays();

  assert.equal(delays.headline, 0);
  assert.ok(delays.bio > delays.headline);
  assert.ok(delays.wellFade >= delays.bio);
  assert.equal(delays.wellCopy, delays.wellFade);
  assert.ok(delays.wellCta >= delays.wellCopy);
  assert.ok(delays.theme >= delays.wellCta);
  assert.ok(delays.intervalMs >= 12);
  assert.ok(delays.theme <= 5200, `expected theme delay <= 5200ms, got ${delays.theme}`);
});
