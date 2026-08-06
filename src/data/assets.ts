/**
 * CDN URLs for binary media assets hosted on Vercel Blob (portfolio-media3 store).
 * To re-upload: run `export $(grep -v '^#' .env.local | xargs) && npx tsx scripts/upload-assets.ts`
 */
const BLOB = 'https://cjeb7madwget0lzn.public.blob.vercel-storage.com';

export const ASSETS = {
  audio: {
    caseyIntro: `${BLOB}/casey-intro.m4a`,
  },
  video: {
    caseyRcs: `${BLOB}/casey-rcs.mp4`,
    mementoDemo: `${BLOB}/memento-demo.mp4`,
    salesforceHelp: `${BLOB}/salesforce-help.mp4`,
    chaseMyHomeDemo: `${BLOB}/chase-myhome-demo.mp4`,
    writerRewrite: `${BLOB}/writer-rewrite.mp4`,
    chorusDemo: `${BLOB}/chorus-ai-demo.mp4`,
  },
  posters: {
    caseyRcs: '/assets/posters/casey-rcs.jpg',
    mementoDemo: '/assets/posters/memento-demo.jpg',
    salesforceHelp: '/assets/posters/salesforce-help.jpg',
    chaseMyHomeDemo: '/assets/posters/chase-myhome-demo.jpg',
    writerRewrite: '/assets/posters/writer-rewrite.jpg',
    chorusDemo: '/assets/posters/chorus-ai-demo.jpg',
  },
} as const;

export const BLOB_HOST = 'cjeb7madwget0lzn.public.blob.vercel-storage.com';

export function getVideoPoster(videoUrl: string): string | undefined {
  const videoKeys = Object.keys(ASSETS.video) as Array<keyof typeof ASSETS.video>;
  for (const key of videoKeys) {
    if (ASSETS.video[key] === videoUrl) {
      return ASSETS.posters[key];
    }
  }
  return undefined;
}
