import type { Metadata } from 'next';
import { WorkPageShell } from '@/components/WorkPageShell/WorkPageShell';
import { getMergedProjects } from '@/lib/cms-data';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import { SITE_DESCRIPTION, WORK_PAGE_BIO } from '@/lib/site';
import './work-page.css';

export const revalidate = 60;

export const metadata: Metadata = createMetadata({
  title: 'Work',
  description: SITE_DESCRIPTION,
  ...canonicalPath('/'),
  openGraph: {
    title: 'Work — Sebastian Mendo',
    description: SITE_DESCRIPTION,
  },
});

export default async function WorkPage() {
  const projects = await getMergedProjects();

  return <WorkPageShell bioText={WORK_PAGE_BIO} projects={projects} />;
}
