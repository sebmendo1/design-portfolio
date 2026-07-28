/**
 * One-time upload script: pushes binary media assets to Vercel Blob.
 * Requires BLOB_READ_WRITE_TOKEN in .env.local (run `vercel env pull .env.local` first).
 *
 * Usage: npx tsx scripts/upload-assets.ts
 */
import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import path from 'path';

const ASSETS = [
  { name: 'casey-intro.m4a', type: 'audio/mp4' },
  { name: 'casey-rcs.mp4', type: 'video/mp4' },
  { name: 'memento-demo.mp4', type: 'video/mp4' },
  { name: 'salesforce-help.mp4', type: 'video/mp4' },
  { name: 'chase-myhome-demo.mp4', type: 'video/mp4' },
  { name: 'writer-rewrite.mp4', type: 'video/mp4' },
] as const;

(async () => {
  for (const asset of ASSETS) {
    const filePath = path.join('public/assets', asset.name);
    console.log(`Uploading ${asset.name}...`);
    const buf = readFileSync(filePath);
    const blob = await put(asset.name, buf, {
      access: 'public',
      contentType: asset.type,
      allowOverwrite: true,
    });
    console.log(`✓  ${asset.name}`);
    console.log(`   → ${blob.url}\n`);
  }
  console.log('Done. Paste the URLs above into src/data/assets.ts');
})();
