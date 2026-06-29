import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CaseStudyPageContent } from '@/components/CaseStudyPageContent/CaseStudyPageContent';
import { projects } from '@/data/projects';
import { getMergedProject } from '@/lib/cms-data';
import './case-study.css';

export const revalidate = 60;

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
  return {
    title,
    description,
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

  return <CaseStudyPageContent project={project} />;
}
