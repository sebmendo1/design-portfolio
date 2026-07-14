import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CaseStudyPageContent } from '@/components/CaseStudyPageContent/CaseStudyPageContent';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { projects } from '@/data/projects';
import { getMergedProject } from '@/lib/cms-data';
import { exportMergedProject } from '@/lib/content-export';
import { buildCreativeWorkGraph } from '@/lib/json-ld';
import { canonicalPath } from '@/lib/metadata';
import { getSiteUrl } from '@/lib/site';
import './case-study.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getMergedProject(slug);
  if (!project) return {};
  const title = project.title;
  const description = project.description ?? project.tagline;
  const siteUrl = getSiteUrl();
  return {
    title,
    description,
    ...canonicalPath(`/work/${slug}`),
    authors: [{ name: 'Sebastian Mendo', url: siteUrl }],
    keywords: project.tags,
    openGraph: {
      title: `${title} — Sebastian Mendo`,
      description,
      type: 'article',
    },
    twitter: {
      title: `${title} — Sebastian Mendo`,
      description,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await getMergedProject(slug);
  if (!project) notFound();

  const exported = exportMergedProject(project);

  return (
    <>
      <StructuredData data={buildCreativeWorkGraph(exported)} />
      <CaseStudyPageContent project={project} />
    </>
  );
}
