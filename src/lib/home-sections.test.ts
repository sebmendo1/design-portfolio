import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PORTFOLIO_INDEX } from '../data/portfolioIndex';
import { groupHomeSections, HOME_SECTIONS } from './home-sections';

test('every portfolio entry lands in exactly one nav section', () => {
  const grouped = groupHomeSections();
  const ids = grouped.flatMap((section) => section.items.map((item) => item.id));

  assert.equal(ids.length, PORTFOLIO_INDEX.length);
  assert.equal(new Set(ids).size, ids.length);
});

test('sections keep nav order and drop empty ones', () => {
  const grouped = groupHomeSections();
  const order = HOME_SECTIONS.map((section) => section.id);

  let last = -1;
  for (const section of grouped) {
    const index = order.indexOf(section.id);
    assert.ok(index > last, `${section.id} is out of nav order`);
    assert.ok(section.items.length > 0, `${section.id} rendered empty`);
    last = index;
  }
});

test('card descriptions stay on one line in the desktop meta row', () => {
  for (const entry of PORTFOLIO_INDEX) {
    assert.ok(entry.description.length > 0, `${entry.id} has no description`);
    assert.ok(
      entry.description.length <= 64,
      `${entry.id} description is ${entry.description.length} characters`,
    );
  }
});
