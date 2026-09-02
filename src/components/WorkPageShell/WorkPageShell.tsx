'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { WorkPageContent } from '@/components/WorkPageContent/WorkPageContent';
import {
  DISSOLVE_EASE,
  DISSOLVE_EXIT_DURATION,
  DISSOLVE_REVEAL_DURATION,
  DISSOLVE_REVEAL_EASE,
} from '@/components/DissolveIn/DissolveIn';
import { useDissolveNavigate } from '@/hooks/useDissolveNavigate';
import type { ProjectCardSummary } from '@/lib/project-cards';

type WorkPageShellProps = {
  bioText: string;
  projects: ProjectCardSummary[];
  initialPreviewId?: string;
};

export function WorkPageShell({ bioText, projects, initialPreviewId }: WorkPageShellProps) {
  const { navigate, isExiting } = useDissolveNavigate();
  const shouldReduce = useReducedMotion();

  return (
    <div className="work-page">
      <motion.div
        className="work-page__content"
        initial={shouldReduce ? false : { opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{
          duration: shouldReduce
            ? 0
            : isExiting
              ? DISSOLVE_EXIT_DURATION
              : DISSOLVE_REVEAL_DURATION,
          ease: isExiting ? DISSOLVE_EASE : DISSOLVE_REVEAL_EASE,
        }}
        style={{ pointerEvents: isExiting ? 'none' : undefined }}
      >
        <main id="main-content">
          <WorkPageContent
            bioText={bioText}
            projects={projects}
            onProjectNavigate={navigate}
            initialPreviewId={initialPreviewId}
          />
        </main>
      </motion.div>
    </div>
  );
}
