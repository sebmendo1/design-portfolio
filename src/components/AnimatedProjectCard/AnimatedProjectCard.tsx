'use client';

import { DissolveIn, DISSOLVE_STAGGER } from '@/components/DissolveIn/DissolveIn';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import type { Project } from '@/data/projects';

type AnimatedProjectCardProps = {
  project: Project;
  index: number;
  reveal: boolean;
  onNavigate?: (href: string) => void;
};

export function AnimatedProjectCard({
  project,
  index,
  reveal,
  onNavigate,
}: AnimatedProjectCardProps) {
  return (
    <DissolveIn className="work-page__card-reveal" delay={index * DISSOLVE_STAGGER} reveal={reveal}>
      <ProjectCard project={project} onNavigate={onNavigate} />
    </DissolveIn>
  );
}
