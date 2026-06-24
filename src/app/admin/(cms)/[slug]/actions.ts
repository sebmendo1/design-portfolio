'use server';
import { revalidatePath } from 'next/cache';
import {
  updateProjectBeats,
  updateProjectMedia,
  type CmsBeat,
  type CmsMediaData,
} from '@/lib/cms-data';
import { requireAdminSession, sanitizeMediaData } from '@/lib/admin-auth';

export async function saveBeatsAction(
  slug: string,
  beats: CmsBeat[],
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminSession();
    await updateProjectBeats(slug, beats);
    revalidatePath(`/work/${slug}`);
    revalidatePath('/');
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
    revalidatePath(`/work/${slug}`);
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return { success: false, error: 'Unauthorized.' };
    }
    return { success: false, error: 'Failed to save media.' };
  }
}
