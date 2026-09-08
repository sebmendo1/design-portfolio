import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildIndexStreamDelays } from './index-stream';

test('index stream reveals the well after the bio and finishes near 2.5s', () => {
  const delays = buildIndexStreamDelays();

  assert.equal(delays.headline, 0);
  assert.ok(delays.bio > delays.headline);
  assert.ok(delays.wellFade >= delays.bio);
  assert.ok(delays.theme >= delays.wellFade);
  assert.ok(delays.intervalMs >= 12);
  assert.ok(delays.theme <= 2600, `expected theme delay <= 2600ms, got ${delays.theme}`);
});
