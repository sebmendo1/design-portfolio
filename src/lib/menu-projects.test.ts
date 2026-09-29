import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CASE_STUDIES } from '@/data/caseStudies';
import { getMenuProjectGroups } from './menu-projects';

test('menu projects follow case-study order and group by company', () => {
  const groups = getMenuProjectGroups();
  const slugs = groups.flatMap((group) => group.items.map((item) => item.slug));
  assert.deepEqual(
    slugs,
    CASE_STUDIES.map((study) => study.slug),
  );
  assert.ok(groups.some((group) => group.items.length > 1), 'Chase should share a company group');
  for (const group of groups) {
    for (const item of group.items) {
      assert.equal(item.href, `/work/${item.slug}`);
      assert.ok(item.title.trim());
      assert.equal(item.company, group.company);
    }
  }
});
