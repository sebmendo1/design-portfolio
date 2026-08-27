/**
 * Re-encode portfolio demo videos for the web and refresh poster frames.
 *
 * Reads local files from public/assets when present, otherwise downloads the
 * current Vercel Blob URLs. Writes optimized MP4s next to the sources and
 * compressed JPEGs into public/assets/posters.
 *
 * Usage:
 *   npx tsx scripts/optimize-videos.ts
 *   npx tsx scripts/optimize-videos.ts --upload
 *
 * --upload requires BLOB_READ_WRITE_TOKEN (vercel env pull .env.local).
 */
import { put } from '@vercel/blob';
import { execFile } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const BLOB = 'https://cjeb7madwget0lzn.public.blob.vercel-storage.com';
const ASSETS_DIR = path.join('public', 'assets');
const POSTERS_DIR = path.join(ASSETS_DIR, 'posters');
const SHOULD_UPLOAD = process.argv.includes('--upload');

type VideoKind = 'phone' | 'browser';

type VideoJob = {
  name: string;
  kind: VideoKind;
  mobile?: string;
};

const VIDEOS: VideoJob[] = [
  { name: 'casey-rcs.mp4', kind: 'phone' },
  { name: 'memento-demo.mp4', kind: 'phone' },
  { name: 'chase-myhome-demo.mp4', kind: 'phone' },
  { name: 'salesforce-help.mp4', kind: 'browser' },
  { name: 'writer-rewrite.mp4', kind: 'browser', mobile: 'writer-rewrite-720.mp4' },
  { name: 'chorus-ai-demo.mp4', kind: 'browser', mobile: 'chorus-ai-demo-720.mp4' },
];

function posterName(videoName: string): string {
  return videoName.replace(/\.mp4$/i, '.jpg');
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadTo(url: string, dest: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  await pipeline(response.body as unknown as NodeJS.ReadableStream, createWriteStream(dest));
}

async function resolveSource(name: string): Promise<string> {
  const localPath = path.join(ASSETS_DIR, name);
  if (await fileExists(localPath)) {
    console.log(`  source: ${localPath}`);
    return localPath;
  }

  const dest = path.join(ASSETS_DIR, `.source-${name}`);
  const url = `${BLOB}/${name}`;
  console.log(`  download: ${url}`);
  await downloadTo(url, dest);
  return dest;
}

async function encodeMp4(input: string, output: string, maxEdge: number, crf: number) {
  const vf = `scale=w='trunc(min(${maxEdge}\\,iw)/2)*2':h=-2`;
  await execFileAsync('ffmpeg', [
    '-y',
    '-i',
    input,
    '-vf',
    vf,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-profile:v',
    'high',
    '-level',
    '4.1',
    '-crf',
    String(crf),
    '-preset',
    'medium',
    '-an',
    '-r',
    '30',
    '-movflags',
    '+faststart',
    output,
  ]);
}

async function encodePoster(input: string, output: string) {
  const tmp = `${output}.tmp.jpg`;
  await execFileAsync('ffmpeg', [
    '-y',
    '-i',
    input,
    '-frames:v',
    '1',
    '-vf',
    "scale=w='min(1280\\,iw)':h=-2",
    '-q:v',
    '6',
    tmp,
  ]);
  await rename(tmp, output);
}

async function uploadFile(name: string, filePath: string, contentType: string) {
  const buf = await import('node:fs/promises').then((fs) => fs.readFile(filePath));
  const blob = await put(name, buf, {
    access: 'public',
    contentType,
    allowOverwrite: true,
  });
  console.log(`  uploaded ${name} → ${blob.url}`);
  return blob.url;
}

async function fileSizeLabel(filePath: string): Promise<string> {
  const { size } = await stat(filePath);
  return `${(size / 1024 / 1024).toFixed(2)} MiB`;
}

(async () => {
  await mkdir(ASSETS_DIR, { recursive: true });
  await mkdir(POSTERS_DIR, { recursive: true });

  for (const job of VIDEOS) {
    console.log(`\n${job.name}`);
    const source = await resolveSource(job.name);
    const output = path.join(ASSETS_DIR, job.name);
    const maxEdge = job.kind === 'phone' ? 750 : 1280;
    const crf = job.kind === 'phone' ? 26 : 27;

    console.log(`  encode ≤${maxEdge}px crf ${crf}`);
    const tmpOutput = `${output}.tmp.mp4`;
    await encodeMp4(source, tmpOutput, maxEdge, crf);
    await rename(tmpOutput, output);
    console.log(`  output ${await fileSizeLabel(output)}`);

    const posterPath = path.join(POSTERS_DIR, posterName(job.name));
    const posterSource = (await fileExists(posterPath)) ? posterPath : output;
    await encodePoster(posterSource, posterPath);
    console.log(`  poster ${posterPath}`);

    if (job.mobile) {
      const mobilePath = path.join(ASSETS_DIR, job.mobile);
      console.log(`  encode mobile ${job.mobile} ≤720px`);
      await encodeMp4(source, mobilePath, 720, 28);
      console.log(`  output ${await fileSizeLabel(mobilePath)}`);
    }

    if (SHOULD_UPLOAD) {
      await uploadFile(job.name, output, 'video/mp4');
      if (job.mobile) {
        await uploadFile(job.mobile, path.join(ASSETS_DIR, job.mobile), 'video/mp4');
      }
    }
  }

  console.log('\nDone.');
  if (!SHOULD_UPLOAD) {
    console.log('Re-run with --upload to push MP4s to Vercel Blob.');
  }
})().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
