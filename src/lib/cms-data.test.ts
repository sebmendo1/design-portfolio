import assert from 'node:assert/strict';
import { test } from 'node:test';
import { projects } from '../data/projects';
import { mergeProject } from './cms-data';

test('CMS preview src cannot replace shipped Memento stills', () => {
  const memento = projects.find((project) => project.slug === 'memento-ai');
  assert.ok(memento?.preview);

  const merged = mergeProject(memento, {
    thumbnail: '/assets/memento-ai.png',
    preview: { src: '/assets/memento-ai.png' },
  });

  assert.equal(merged.preview?.src, '/assets/memento-journal-feed.png');
  assert.equal(merged.preview?.companions?.[0]?.src, '/assets/memento-insights.png');
  assert.equal(merged.thumbnail, '/assets/memento-journal-feed.png');
});

test('CMS can still attach preview video and url', () => {
  const salesforce = projects.find((project) => project.slug === 'salesforce-help');
  assert.ok(salesforce?.preview);

  const merged = mergeProject(salesforce, {
    preview: {
      video: 'https://example.com/salesforce-help.mp4',
      url: 'help.salesforce.com/s/contactsupport',
    },
  });

  assert.equal(merged.preview?.src, salesforce.preview.src);
  assert.equal(merged.preview?.video, 'https://example.com/salesforce-help.mp4');
  assert.equal(merged.preview?.url, 'help.salesforce.com/s/contactsupport');
});
