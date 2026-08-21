import type { Metadata } from 'next';
import { HomeSrArticle } from '@/components/HomeSrArticle/HomeSrArticle';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { WorkPageShell } from '@/components/WorkPageShell/WorkPageShell';
import { getCachedMergedProjects } from '@/lib/cms-data';
import { buildPortfolioExport, exportMergedProject } from '@/lib/content-export';
import { buildWorkCollectionGraph } from '@/lib/json-ld';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import { toProjectCardSummaries } from '@/lib/project-cards';
import { SITE_DESCRIPTION, SITE_TITLE, WORK_PAGE_BIO } from '@/lib/site';
import './work-page.css';

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

export default async function WorkPage() {
  const [projects, data] = await Promise.all([
    getCachedMergedProjects(),
    buildPortfolioExport(),
  ]);

  return (
    <>
      <StructuredData data={buildWorkCollectionGraph(projects.map(exportMergedProject))} />
      <HomeSrArticle data={data} />
      <WorkPageShell
        bioText={WORK_PAGE_BIO}
        projects={toProjectCardSummaries(projects)}
      />
    </>
  );
}
