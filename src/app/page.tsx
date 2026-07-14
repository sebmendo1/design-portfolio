import type { Metadata } from 'next';
import { WorkPageShell } from '@/components/WorkPageShell/WorkPageShell';
import { getCachedMergedProjects } from '@/lib/cms-data';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import { toProjectCardSummaries } from '@/lib/project-cards';
import { SITE_DESCRIPTION, SITE_TITLE, WORK_PAGE_BIO } from '@/lib/site';
import './work-page.css';

export const metadata: Metadata = createMetadata({
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  ...canonicalPath('/'),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
});

export default async function WorkPage() {
  const projects = await getCachedMergedProjects();

  return (
    <WorkPageShell
      bioText={WORK_PAGE_BIO}
      projects={toProjectCardSummaries(projects)}
    />
  );
}
