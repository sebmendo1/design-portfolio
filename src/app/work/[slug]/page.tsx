import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation/Navigation';
import { CaseStudyScrolly } from '@/components/CaseStudyScrolly/CaseStudyScrolly';
import { projects } from '@/data/projects';
import './case-study.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Sebastian Mendo`,
    description: project.description,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="case-study">
      <Navigation />

      <div className="case-study__header">
        <Link href="/" className="case-study__back">
          ← Work
        </Link>
      </div>

      {project.scrollyConfig && (
        <CaseStudyScrolly config={project.scrollyConfig} />
      )}
    </div>
  );
}
