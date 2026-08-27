import assert from 'node:assert/strict';
import { test } from 'node:test';
import { projects } from '../data/projects';
import { exportMergedProject } from './content-export';
import { buildCreativeWorkGraph, buildSiteGraph, practiceOrganizationNode } from './json-ld';
import { SITE_ADDRESS, SITE_CONTACT_EMAIL } from './site';

test('site graph Organization includes contactPoint and address', () => {
  const graph = buildSiteGraph();
  const nodes = (graph['@graph'] as Array<Record<string, unknown>>) ?? [];
  const org = nodes.find((node) => node['@type'] === 'Organization');
  assert.ok(org, 'expected an Organization node');

  const contact = org.contactPoint as Record<string, unknown>;
  assert.equal(contact['@type'], 'ContactPoint');
  assert.equal(contact.email, SITE_CONTACT_EMAIL);
  assert.equal(contact.contactType, 'professional');

  const address = org.address as Record<string, unknown>;
  assert.equal(address['@type'], 'PostalAddress');
  assert.equal(address.addressLocality, SITE_ADDRESS.addressLocality);
  assert.equal(address.addressRegion, SITE_ADDRESS.addressRegion);
  assert.equal(address.addressCountry, SITE_ADDRESS.addressCountry);
});

test('practice Organization can be embedded on trust pages', () => {
  const org = practiceOrganizationNode('https://www.sebmendo.design');
  assert.equal(org['@type'], 'Organization');
  assert.ok(org.contactPoint);
  assert.ok(org.address);
});

test('case study JSON-LD cites impact IDs as PropertyValue', () => {
  const casey = projects.find((project) => project.slug === 'casey-ai');
  assert.ok(casey);
  const graph = buildCreativeWorkGraph(exportMergedProject(casey));
  const nodes = (graph['@graph'] as Array<Record<string, unknown>>) ?? [];
  const work = nodes.find((node) => node['@type'] === 'CreativeWork');
  assert.ok(work);
  const properties = work.additionalProperty as Array<Record<string, unknown>>;
  assert.ok(properties.some((item) => item.identifier === 'casey-production'));
  assert.ok(properties.some((item) => item.propertyID === 'casey-production'));
});
