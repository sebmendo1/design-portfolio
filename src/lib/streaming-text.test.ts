import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  countWords,
  createStreamCursor,
  splitIntoUnits,
  streamDurationMs,
  streamSpanMs,
  streamWordDelay,
  STREAM_MAX_SPAN_MS,
  WORD_ANIMATION_MS,
  WORD_INTERVAL_MS,
} from './streaming-text';

test('splitIntoUnits keeps words and their trailing spacing', () => {
  assert.deepEqual(splitIntoUnits('a  b'), [
    { word: 'a', space: '  ' },
    { word: 'b', space: '' },
  ]);
  assert.equal(countWords(''), 0);
  assert.equal(countWords('one two three'), 3);
});

test('word delays rise continuously from zero to the full span', () => {
  const total = 40;
  const span = streamSpanMs(total);

  assert.equal(streamWordDelay(0, total), 0);
  assert.equal(streamWordDelay(total - 1, total), span);

  let previous = -1;
  for (let i = 0; i < total; i += 1) {
    const delay = streamWordDelay(i, total);
    assert.ok(delay >= previous, `word ${i} went backwards`);
    previous = delay;
  }
});

test('consecutive words always overlap, so the stream never reads as separate steps', () => {
  const total = 94;

  for (let i = 1; i < total; i += 1) {
    const gap = streamWordDelay(i, total) - streamWordDelay(i - 1, total);
    assert.ok(
      gap < WORD_ANIMATION_MS,
      `word ${i} starts ${gap}ms after the previous one, which exceeds the ${WORD_ANIMATION_MS}ms entrance`,
    );
  }
});

test('long streams are capped instead of growing without bound', () => {
  const huge = 5000;

  assert.equal(streamSpanMs(huge), STREAM_MAX_SPAN_MS);
  assert.equal(streamDurationMs(huge), STREAM_MAX_SPAN_MS + WORD_ANIMATION_MS);
  assert.ok(streamWordDelay(huge - 1, huge) <= STREAM_MAX_SPAN_MS);
});

test('short streams use the base cadence', () => {
  assert.equal(streamSpanMs(1), 0);
  assert.equal(streamWordDelay(0, 1), 0);
  assert.equal(streamSpanMs(5), 4 * WORD_INTERVAL_MS);
});

test('the ramp front-loads spacing so the tail accelerates', () => {
  const total = 100;
  const span = streamSpanMs(total);
  const halfway = streamWordDelay(Math.floor(total / 2), total);

  assert.ok(
    halfway > span / 2,
    'the first half of the words should take more than half the span',
  );
});

test('the cursor hands out contiguous word offsets', () => {
  const cursor = createStreamCursor();

  assert.equal(cursor.take('one two'), 0);
  assert.equal(cursor.take('three'), 2);
  assert.equal(cursor.takeWords(4), 3);
  assert.equal(cursor.total, 7);
});
