/**
 * CDN URLs for binary media assets hosted on Vercel Blob (portfolio-media3 store).
 * To re-upload: run `export $(grep -v '^#' .env.local | xargs) && npx tsx scripts/upload-assets.ts`
 */
export const ASSETS = {
  audio: {
    caseyIntro: 'https://cjeb7madwget0lzn.public.blob.vercel-storage.com/casey-intro.m4a',
  },
  video: {
    caseyRcs:        'https://cjeb7madwget0lzn.public.blob.vercel-storage.com/casey-rcs.mp4',
    mementoDemo:     'https://cjeb7madwget0lzn.public.blob.vercel-storage.com/memento-demo.mp4',
    salesforceHelp:  'https://cjeb7madwget0lzn.public.blob.vercel-storage.com/salesforce-help.mp4',
    chaseMyHomeDemo: 'https://cjeb7madwget0lzn.public.blob.vercel-storage.com/chase-myhome-demo.mov',
  },
} as const;
