import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CaseStudyScrolly } from '@/components/CaseStudyScrolly/CaseStudyScrolly';
import { CaseyActions } from '@/components/CaseyActions/CaseyActions';
import { ProjectAboutBlock } from '@/components/ProjectAboutBlock/ProjectAboutBlock';
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

  return (
    <div className="case-study">
      <div className="case-study__header">
        <Link href="/" className="case-study__back">
          ← Go back
        </Link>
      </div>

      <main id="main-content">
        {project.scrollyConfig && (
          <CaseStudyScrolly
            config={project.scrollyConfig}
            slot={
              <>
                <ProjectAboutBlock project={project} />
                {project.slug === 'casey-ai' && <CaseyActions />}
              </>
            }
          />
        )}
      </main>
    </div>
  );
}
