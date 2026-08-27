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
      url: `${base}/contact`,
      lastModified: profileUpdated,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/privacy`,
      lastModified: profileUpdated,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${base}/impact.json`,
      lastModified: profileUpdated,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${base}/seb-sans`,
      lastModified: profileUpdated,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${base}/seb-sans/install.json`,
      lastModified: profileUpdated,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${base}/seb-sans/llms.txt`,
      lastModified: profileUpdated,
      changeFrequency: 'monthly',
      priority: 0.3,
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
    {
      url: `${base}/.well-known/ai.txt`,
      lastModified: profileUpdated,
      changeFrequency: 'weekly',
      priority: 0.45,
    },
    ...projects.flatMap((project) => [
      {
        url: `${base}/work/${project.slug}`,
        lastModified: profileUpdated,
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      },
      {
        url: `${base}/work/${project.slug}/content.json`,
        lastModified: profileUpdated,
        changeFrequency: 'monthly' as const,
        priority: 0.35,
      },
    ]),
  ];
}
