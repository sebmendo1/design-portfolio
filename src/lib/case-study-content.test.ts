import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CASE_STUDIES } from '../data/caseStudies';
import { getTldrSentences, getTldrText } from '../data/caseStudies/types';
import { projects } from '../data/projects';
import {
  BANNED_WORDS,
  countSentences,
  countWords,
  getBodyText,
  getBodyWordCount,
  getCaptions,
} from './case-study-content';

const BODY_WORD_CAP = 900;

for (const study of CASE_STUDIES) {
  test(`${study.slug}: title is a claim of 12 words or fewer`, () => {
    assert.ok(countWords(study.title) <= 12, study.title);
  });

  test(`${study.slug}: TL;DR is 60 words or fewer`, () => {
    const text = getTldrText(study);
    assert.ok(countWords(text) <= 60, `${countWords(text)} words`);
  });

  test(`${study.slug}: TL;DR follows STAR in 4 sentences or fewer`, () => {
    for (const sentence of getTldrSentences(study)) {
      assert.equal(countSentences(sentence), 1, `not one sentence: ${sentence}`);
    }
    const text = getTldrText(study);
    assert.ok(countSentences(text) <= 4, `${countSentences(text)} sentences`);
  });

  test(`${study.slug}: 2–3 decisions, each with an alternative and a trade-off`, () => {
    const { items } = study.decisions;
    assert.ok(items.length >= 2 && items.length <= 3, `${items.length} decisions`);
    for (const item of items) {
      assert.ok(item.alternative.trim(), `${item.title} is missing an alternative`);
      assert.ok(item.tradeoff.trim(), `${item.title} is missing a trade-off`);
    }
  });

  test(`${study.slug}: captions argue in 25 words or fewer`, () => {
    for (const caption of getCaptions(study)) {
      assert.ok(countWords(caption) <= 25, caption);
    }
  });

  test(`${study.slug}: body stays under the hard cap`, () => {
    assert.ok(getBodyWordCount(study) <= BODY_WORD_CAP, `${getBodyWordCount(study)} words`);
  });

  test(`${study.slug}: no banned words`, () => {
    const text = [study.title, study.summary, ...getBodyText(study), ...getCaptions(study)]
      .join(' ')
      .toLowerCase();
    for (const word of BANNED_WORDS) {
      assert.ok(!new RegExp(`\\b${word}\\b`).test(text), `uses "${word}"`);
    }
  });
}

test('every case study project has structured content', () => {
  const slugs = new Set(CASE_STUDIES.map((study) => study.slug));
  for (const project of projects) {
    assert.ok(slugs.has(project.slug), `${project.slug} has no case study content`);
  }
});

test('case study slugs are unique', () => {
  const slugs = CASE_STUDIES.map((study) => study.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
