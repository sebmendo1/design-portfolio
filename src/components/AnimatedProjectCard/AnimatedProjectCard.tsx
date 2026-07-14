'use client';

import {
  DissolveIn,
  DISSOLVE_REVEAL_DURATION,
  DISSOLVE_REVEAL_EASE,
  DISSOLVE_REVEAL_STAGGER,
} from '@/components/DissolveIn/DissolveIn';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import '@/components/StreamingText/StreamingText.css';
import type { ProjectCardSummary } from '@/lib/project-cards';

type AnimatedProjectCardProps = {
  project: ProjectCardSummary;
  index: number;
  reveal?: boolean;
  streamIn?: boolean;
  onNavigate?: (href: string) => void;
};

export function AnimatedProjectCard({
  project,
  index,
  reveal = true,
  streamIn = false,
  onNavigate,
}: AnimatedProjectCardProps) {
  if (streamIn) {
    return (
      <div className="work-page__card-reveal streaming-text__unit streaming-text__unit--visible">
        <div className="streaming-text__word work-page__card-reveal-inner">
          <ProjectCard project={project} onNavigate={onNavigate} />
        </div>
      </div>
    );
  }

  return (
    <DissolveIn
      className="work-page__card-reveal"
      delay={index * DISSOLVE_REVEAL_STAGGER}
      reveal={reveal}
      duration={DISSOLVE_REVEAL_DURATION}
      ease={DISSOLVE_REVEAL_EASE}
    >
      <ProjectCard project={project} onNavigate={onNavigate} />
    </DissolveIn>
  );
}
