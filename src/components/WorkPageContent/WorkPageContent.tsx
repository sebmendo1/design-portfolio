'use client';

import { HomeFeed } from '@/components/HomeFeed/HomeFeed';
import type { ProjectCardSummary } from '@/lib/project-cards';

type WorkPageContentProps = {
  bioText: string;
  projects: ProjectCardSummary[];
  onProjectNavigate?: (href: string) => void;
};

export function WorkPageContent({
  projects,
  onProjectNavigate,
}: WorkPageContentProps) {
  return <HomeFeed projects={projects} onNavigate={onProjectNavigate} />;
}
