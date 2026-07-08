import { put, list } from '@vercel/blob';
import { projects, sortProjectsByFeaturedOrder, type Project } from '@/data/projects';

export type CmsBeat = {
  id: string;
  headline: string;
  body?: string;
};

export type CmsMediaData = {
  thumbnail?: string;
  preview?: { src?: string; video?: string; url?: string };
  centerpiece?: { src?: string; video?: string; url?: string };
};

export type CmsProjectData = {
  beats?: CmsBeat[];
} & CmsMediaData;

type CmsData = Record<string, CmsProjectData>;

const BLOB_PATH = 'cms/projects.json';
const BLOB_TIMEOUT_MS = 5_000;

async function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeoutId = setTimeout(() => resolve(fallback), BLOB_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function getProjectsData(): Promise<CmsData> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const { blobs } = await withTimeout(list({ prefix: BLOB_PATH }), {
      blobs: [],
      hasMore: false,
      cursor: undefined,
    });
    if (blobs.length === 0) return {};
    const res = await withTimeout(
      fetch(blobs[0].url, {
        cache: 'no-store',
        signal: AbortSignal.timeout(BLOB_TIMEOUT_MS),
      }),
      null,
    );
    if (!res?.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

async function saveProjectsData(data: CmsData): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

function mergeProject(base: Project, cms: CmsProjectData | undefined): Project {
  if (!cms) return base;
  return {
    ...base,
    thumbnail: cms.thumbnail ?? base.thumbnail,
    preview:
      base.preview && cms.preview
        ? { ...base.preview, ...cms.preview }
        : base.preview,
    scrollyConfig: base.scrollyConfig
      ? {
          ...base.scrollyConfig,
          beats: base.scrollyConfig.beats.map((beat) => {
            const ov = cms.beats?.find((b) => b.id === beat.id);
            return ov
              ? { ...beat, headline: ov.headline, body: ov.body ?? beat.body }
              : beat;
          }),
          stage: cms.centerpiece
            ? {
                ...base.scrollyConfig.stage,
                centerpiece: {
                  ...base.scrollyConfig.stage.centerpiece,
                  ...cms.centerpiece,
                },
              }
            : base.scrollyConfig.stage,
        }
      : base.scrollyConfig,
  };
}

export async function getMergedProjects(): Promise<Project[]> {
  const data = await getProjectsData();
  return sortProjectsByFeaturedOrder(
    projects.map((p) => mergeProject(p, data[p.slug])),
  );
}

export async function getMergedProject(slug: string): Promise<Project | undefined> {
  const base = projects.find((p) => p.slug === slug);
  if (!base) return undefined;
  const data = await getProjectsData();
  return mergeProject(base, data[slug]);
}

export async function updateProjectBeats(slug: string, beats: CmsBeat[]): Promise<void> {
  const data = await getProjectsData();
  data[slug] = { ...data[slug], beats };
  await saveProjectsData(data);
}

export async function updateProjectMedia(slug: string, media: CmsMediaData): Promise<void> {
  const data = await getProjectsData();
  data[slug] = { ...data[slug], ...media };
  await saveProjectsData(data);
}
