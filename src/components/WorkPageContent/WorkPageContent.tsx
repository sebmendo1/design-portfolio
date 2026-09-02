'use client';

import { IndexBio } from '@/components/WorkPageBio/IndexBio';
import { PortfolioIndex } from '@/components/PortfolioIndex/PortfolioIndex';
import type { ProjectCardSummary } from '@/lib/project-cards';

type WorkPageContentProps = {
  bioText: string;
  projects: ProjectCardSummary[];
  onProjectNavigate?: (href: string) => void;
  initialPreviewId?: string;
};

export function WorkPageContent({
  projects,
  onProjectNavigate,
  initialPreviewId,
}: WorkPageContentProps) {
  return (
    <PortfolioIndex
      bio={<IndexBio />}
      projects={projects}
      onNavigate={onProjectNavigate}
      initialPreviewId={initialPreviewId}
    />
  );
}
