import type { Metadata } from 'next';
import { HomeSrArticle } from '@/components/HomeSrArticle/HomeSrArticle';
import { HomeVariant } from '@/components/HomeVariant/HomeVariant';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { getCachedMergedProjects } from '@/lib/cms-data';
import { buildPortfolioExport, exportMergedProject } from '@/lib/content-export';
import { buildWorkCollectionGraph } from '@/lib/json-ld';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import { toProjectCardSummaries } from '@/lib/project-cards';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/site';

export const metadata: Metadata = createMetadata({
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  ...canonicalPath('/'),
  alternates: {
    canonical: '/',
    types: {
      'text/markdown': [{ url: '/', title: 'Homepage as Markdown' }],
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
});

export default async function HomePage() {
  const [projects, data] = await Promise.all([
    getCachedMergedProjects(),
    buildPortfolioExport(),
  ]);

  return (
    <>
      <StructuredData data={buildWorkCollectionGraph(projects.map(exportMergedProject))} />
      <HomeSrArticle data={data} />
      <HomeVariant projects={toProjectCardSummaries(projects)} />
    </>
  );
}
