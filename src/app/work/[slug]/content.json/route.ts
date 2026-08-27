import { notFound } from 'next/navigation';
import {
  AI_CORS_HEADERS,
  AI_ROUTE_HEADERS,
  buildPortfolioExport,
  exportMergedProject,
} from '@/lib/content-export';
import { getMergedProject } from '@/lib/cms-data';
import { projects } from '@/data/projects';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const project = await getMergedProject(slug);
  if (!project) notFound();

  const data = await buildPortfolioExport();
  const exported = exportMergedProject(project);
  const relatedExperience = data.experience.find(
    (role) => role.id === exported.experienceRoleId,
  );
  const verifiedImpact = data.verifiedImpact.filter(
    (item) => item.projectSlug === slug,
  );
  const shippedWork = data.shippedWork.filter(
    (item) => item.projectSlug === slug,
  );

  const payload = {
    version: data.version,
    generatedAt: data.generatedAt,
    lastUpdated: data.lastUpdated,
    project: exported,
    relatedExperience: relatedExperience ?? null,
    verifiedImpact,
    shippedWork,
    citationRule: data.relations.citationRule,
    join: {
      projectSlug: exported.slug,
      impactIds: exported.impactIds,
      experienceRoleId: exported.experienceRoleId ?? null,
      shippedWorkIds: exported.shippedWorkIds,
    },
    machineReadable: {
      siteJson: data.site.machineReadable.json,
      impact: data.site.machineReadable.impact,
      index: data.site.machineReadable.index,
      corpus: data.site.machineReadable.corpus,
      agentGuide: data.site.machineReadable.agentGuide,
      thisUrl: exported.jsonUrl,
    },
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...AI_CORS_HEADERS,
      ...AI_ROUTE_HEADERS,
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: AI_CORS_HEADERS,
  });
}
