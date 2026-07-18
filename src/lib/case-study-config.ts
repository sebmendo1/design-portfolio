import type { CaseStudyConfig } from '@/components/CaseStudyScrolly/types';
import type { Project, ProjectPreview } from '@/data/projects';

function previewToCenterpiece(preview: ProjectPreview): CaseStudyConfig['stage']['centerpiece'] {
  const frame: CaseStudyConfig['stage']['centerpiece']['frame'] =
    preview.frame === 'phone' || preview.frame === 'browser'
      ? preview.frame
      : 'none';

  return {
    frame,
    width: frame === 'phone' ? 260 : 400,
    src: preview.src,
    video: preview.video,
    url: preview.url,
    screenAspectRatio: preview.screenAspectRatio,
  };
}

function buildConfigFromBlocks(project: Project): CaseStudyConfig | null {
  const blocks = project.caseStudy?.blocks;
  if (!blocks?.length || !project.preview) return null;

  const beatCount = blocks.length;
  const segmentSize = 1 / beatCount;

  return {
    slug: project.slug,
    title: project.title,
    trackHeightVh: (beatCount + 1) * 100,
    stage: {
      centerpiece: previewToCenterpiece(project.preview),
    },
    beats: blocks.map((block, index) => ({
      id: `block-${index}`,
      headline: index === 0 ? project.title : project.title,
      body: block.text,
      range: [index * segmentSize, (index + 1) * segmentSize],
    })),
    cards: [],
    clusters: [],
  };
}

/** Unified case study layout config for every portfolio project page. */
export function resolveCaseStudyConfig(project: Project): CaseStudyConfig | null {
  if (project.scrollyConfig) return project.scrollyConfig;
  return buildConfigFromBlocks(project);
}
