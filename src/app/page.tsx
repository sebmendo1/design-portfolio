import type { Metadata } from 'next';
import { WorkPageShell } from '@/components/WorkPageShell/WorkPageShell';
import { getMergedProjects } from '@/lib/cms-data';
import { SITE_DESCRIPTION, WORK_PAGE_BIO } from '@/lib/site';
import './work-page.css';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Work',
  description: SITE_DESCRIPTION,
  openGraph: {
    title: 'Work — Sebastian Mendo',
    description: SITE_DESCRIPTION,
  },
};

export default async function WorkPage() {
  const projects = await getMergedProjects();

  return <WorkPageShell bioText={WORK_PAGE_BIO} projects={projects} />;
}
