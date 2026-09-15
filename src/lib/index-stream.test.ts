import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groupPortfolioIndex } from './portfolio-index';
import { buildIndexStreamDelays } from './index-stream';
import { splitIntoUnits, streamLineEndMs, WORD_INTERVAL_MS } from './streaming-text';

test('index stream plays one line at a time after the instant bio', () => {
  const delays = buildIndexStreamDelays();

  assert.equal(delays.headline, 0);
  assert.equal(delays.bio, 0);
  assert.equal(delays.intervalMs, WORD_INTERVAL_MS);
  assert.ok(delays.wellFade >= delays.bio);
  assert.ok(delays.theme >= delays.wellFade);

  let previousEnd = delays.wellFade;

  for (const section of groupPortfolioIndex()) {
    const headingStart = delays.headings[section.id] ?? 0;
    assert.ok(headingStart >= previousEnd, `${section.id} overlapped the previous line`);
    previousEnd = headingStart + streamLineEndMs(splitIntoUnits(section.id).length, delays.intervalMs);

    for (const group of section.years) {
      const yearKey = `${section.id}-${group.year}`;
      const yearStart = delays.years[yearKey] ?? 0;
      assert.ok(yearStart >= previousEnd, `${yearKey} overlapped the previous line`);
      previousEnd =
        yearStart + streamLineEndMs(splitIntoUnits(String(group.year)).length, delays.intervalMs);

      for (const item of group.items) {
        const itemStart = delays.items[item.id] ?? 0;
        assert.ok(itemStart >= previousEnd, `${item.id} overlapped the previous line`);
        previousEnd =
          itemStart + streamLineEndMs(splitIntoUnits(item.label).length, delays.intervalMs);
      }
    }
  }
});
