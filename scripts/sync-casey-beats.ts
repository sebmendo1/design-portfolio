/**
 * Sync Casey AI scrolly beats from src/data/projects.ts into Vercel Blob CMS.
 * Requires BLOB_READ_WRITE_TOKEN in .env.local.
 *
 * Usage: set -a && source .env.local && set +a && npx tsx scripts/sync-casey-beats.ts
 */
import { projects } from '../src/data/projects';
import { updateProjectBeats } from '../src/lib/cms-data';

const SLUG = 'casey-ai';

async function main() {
  const project = projects.find((p) => p.slug === SLUG);
  const beats = project?.scrollyConfig?.beats;
  if (!beats?.length) {
    throw new Error(`No scrolly beats found for ${SLUG}`);
  }

  const cmsBeats = beats.map((beat) => ({
    id: beat.id,
    headline: beat.headline,
    body: beat.body,
  }));

  await updateProjectBeats(SLUG, cmsBeats);
  console.log(`Synced ${cmsBeats.length} beats for ${SLUG} to cms/projects.json`);
  for (const beat of cmsBeats) {
    console.log(`- ${beat.id}: ${beat.headline}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
