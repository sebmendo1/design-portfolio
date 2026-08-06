import { cache } from 'react';
import { unstable_cache } from 'next/cache';
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

/** Legacy slug keys that may still exist in CMS blob data. */
const CMS_SLUG_ALIASES: Record<string, string> = {
  'autods-m-ai': 'autodsm-ai',
};

function resolveCmsEntry(data: CmsData, slug: string): CmsProjectData | undefined {
  return data[slug] ?? data[CMS_SLUG_ALIASES[slug] ?? ''];
}

const BLOB_PATH = 'cms/projects.json';
const BLOB_TIMEOUT_MS = 5_000;
export const CMS_PROJECTS_TAG = 'cms-projects';

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

async function fetchProjectsDataUncached(): Promise<CmsData> {
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
        // Blob JSON is small and must reflect admin/sync edits immediately.
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

const getCachedProjectsData = unstable_cache(
  fetchProjectsDataUncached,
  ['portfolio-cms-projects-v2'],
  {
    revalidate: process.env.NODE_ENV === 'development' ? 1 : 3600,
    tags: [CMS_PROJECTS_TAG],
  },
);

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

async function buildMergedProjects(data: CmsData): Promise<Project[]> {
  return sortProjectsByFeaturedOrder(
    projects.map((p) => mergeProject(p, resolveCmsEntry(data, p.slug))),
  );
}

export const getCachedMergedProjects = cache(async (): Promise<Project[]> => {
  const data = await getCachedProjectsData();
  return buildMergedProjects(data);
});

/** @deprecated Use getCachedMergedProjects */
export async function getMergedProjects(): Promise<Project[]> {
  return getCachedMergedProjects();
}

export const getMergedProject = cache(async (slug: string): Promise<Project | undefined> => {
  const merged = await getCachedMergedProjects();
  const normalizedSlug = CMS_SLUG_ALIASES[slug] ?? slug;
  return merged.find((p) => p.slug === normalizedSlug);
});

export async function updateProjectBeats(slug: string, beats: CmsBeat[]): Promise<void> {
  const data = await fetchProjectsDataUncached();
  data[slug] = { ...data[slug], beats };
  await saveProjectsData(data);
}

export async function updateProjectMedia(slug: string, media: CmsMediaData): Promise<void> {
  const data = await fetchProjectsDataUncached();
  data[slug] = { ...data[slug], ...media };
  await saveProjectsData(data);
}
