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
  /**
   * Narrow encodes for large browser demos (Writer, Chorus).
   * Populate after `npx tsx scripts/optimize-videos.ts --upload`.
   */
  videoMobile: {} as Partial<Record<'writerRewrite' | 'chorusDemo', string>>,
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

type VideoKey = keyof typeof ASSETS.video;
type MobileVideoKey = keyof typeof ASSETS.videoMobile;

function findVideoKey(videoUrl: string): VideoKey | undefined {
  const videoKeys = Object.keys(ASSETS.video) as VideoKey[];
  for (const key of videoKeys) {
    if (ASSETS.video[key] === videoUrl) return key;
    if (key in ASSETS.videoMobile && ASSETS.videoMobile[key as MobileVideoKey] === videoUrl) {
      return key;
    }
  }
  return undefined;
}

export function getVideoPoster(videoUrl: string): string | undefined {
  const key = findVideoKey(videoUrl);
  return key ? ASSETS.posters[key] : undefined;
}

export function getVideoMobileSrc(videoUrl: string): string | undefined {
  const key = findVideoKey(videoUrl);
  if (!key || !(key in ASSETS.videoMobile)) return undefined;
  return ASSETS.videoMobile[key as MobileVideoKey];
}
