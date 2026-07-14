import type { MetadataRoute } from 'next';
import { PROFILE_LAST_UPDATED } from '@/data/profile';
import { getCachedMergedProjects } from '@/lib/cms-data';
import { getSiteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const projects = await getCachedMergedProjects();
  const profileUpdated = new Date(PROFILE_LAST_UPDATED);

  return [
    {
      url: base,
      lastModified: profileUpdated,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: profileUpdated,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/llms.txt`,
      lastModified: profileUpdated,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${base}/llms-full.txt`,
      lastModified: profileUpdated,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${base}/content.json`,
      lastModified: profileUpdated,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    ...projects.map((project) => ({
      url: `${base}/work/${project.slug}`,
      lastModified: profileUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ];
}
