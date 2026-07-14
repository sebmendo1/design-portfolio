'use server';

import { revalidatePath, updateTag } from 'next/cache';
import {
  CMS_PROJECTS_TAG,
  updateProjectBeats,
  updateProjectMedia,
  type CmsBeat,
  type CmsMediaData,
} from '@/lib/cms-data';
import { requireAdminSession, sanitizeMediaData } from '@/lib/admin-auth';

const PUBLIC_PATHS = [
  '/',
  '/about',
  '/llms.txt',
  '/llms-full.txt',
  '/content.json',
  '/sitemap.xml',
  '/robots.txt',
] as const;

function revalidatePublicContent(slug?: string) {
  updateTag(CMS_PROJECTS_TAG);
  for (const path of PUBLIC_PATHS) {
    revalidatePath(path);
  }
  if (slug) {
    revalidatePath(`/work/${slug}`);
  }
}

export async function saveBeatsAction(
  slug: string,
  beats: CmsBeat[],
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminSession();
    await updateProjectBeats(slug, beats);
    revalidatePublicContent(slug);
    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return { success: false, error: 'Unauthorized.' };
    }
    return { success: false, error: 'Failed to save beats.' };
  }
}

export async function saveMediaAction(
  slug: string,
  media: CmsMediaData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminSession();
    const safe = sanitizeMediaData(media);
    await updateProjectMedia(slug, safe);
    revalidatePublicContent(slug);
    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return { success: false, error: 'Unauthorized.' };
    }
    return { success: false, error: 'Failed to save media.' };
  }
}
