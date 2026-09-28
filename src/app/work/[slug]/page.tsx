import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CaseStudyPageContent } from '@/components/CaseStudyPageContent/CaseStudyPageContent';
import { CaseStudySrArticle } from '@/components/CaseStudySrArticle/CaseStudySrArticle';
import { CaseStudyTemplate } from '@/components/CaseStudyTemplate/CaseStudyTemplate';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { CASE_STUDIES, getCaseStudy, getNextCaseStudy } from '@/data/caseStudies';
import { PROFILE_LAST_UPDATED } from '@/data/profile';
import { projects } from '@/data/projects';
import { getMergedProject } from '@/lib/cms-data';
import { resolveCaseStudyConfig } from '@/lib/case-study-config';
import { exportMergedProject } from '@/lib/content-export';
import { buildCreativeWorkGraph } from '@/lib/json-ld';
import { getSiteUrl } from '@/lib/site';
import './case-study.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = new Set([
    ...projects.map((p) => p.slug),
    ...CASE_STUDIES.map((study) => study.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getMergedProject(slug);
  const study = getCaseStudy(slug);
  if (!project && !study) return {};
  const title = project?.title ?? study!.title;
  const description = study?.summary ?? project?.description ?? project?.tagline;
  const siteUrl = getSiteUrl();
  const publishedTime = project?.year
    ? new Date(Date.UTC(project.year, 0, 1)).toISOString()
    : undefined;

  return {
    title,
    description,
    authors: [{ name: 'Sebastian Mendo', url: siteUrl }],
    creator: 'Sebastian Mendo',
    keywords: project?.tags,
    alternates: {
      canonical: `/work/${slug}`,
      ...(project
        ? {
            types: {
              'application/json': [
                {
                  url: `/work/${slug}/content.json`,
                  title: `${title} structured content`,
                },
              ],
              'text/markdown': [
                {
                  url: `/work/${slug}`,
                  title: `${title} as Markdown`,
                },
              ],
            },
          }
        : {}),
    },
    openGraph: {
      title: `${title} — Sebastian Mendo`,
      description,
      type: 'article',
      url: `${siteUrl}/work/${slug}`,
      publishedTime,
      modifiedTime: new Date(PROFILE_LAST_UPDATED).toISOString(),
      authors: [siteUrl],
      section: project?.company ?? study?.company,
      tags: project?.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Sebastian Mendo`,
      description,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await getMergedProject(slug);
  const study = getCaseStudy(slug);
  if (!project && !study) notFound();

  const exported = project ? exportMergedProject(project) : undefined;

  if (study) {
    const next = getNextCaseStudy(slug);
    return (
      <>
        {exported ? <StructuredData data={buildCreativeWorkGraph(exported)} /> : null}
        <CaseStudyTemplate
          study={study}
          next={
            next
              ? { slug: next.slug, title: next.title, summary: next.summary, section: next.section }
              : undefined
          }
        />
      </>
    );
  }

  const caseStudyConfig = project ? resolveCaseStudyConfig(project) : null;
  if (!project || !exported || !caseStudyConfig) notFound();

  return (
    <>
      <StructuredData data={buildCreativeWorkGraph(exported)} />
      <CaseStudySrArticle project={exported} />
      <CaseStudyPageContent project={project} config={caseStudyConfig} />
    </>
  );
}
