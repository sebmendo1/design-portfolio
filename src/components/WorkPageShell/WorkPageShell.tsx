'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation/Navigation';
import { WorkPageContent } from '@/components/WorkPageContent/WorkPageContent';
import { useDissolveNavigate } from '@/hooks/useDissolveNavigate';
import type { Project } from '@/data/projects';

type WorkPageShellProps = {
  bioText: string;
  projects: Project[];
};

export function WorkPageShell({ bioText, projects }: WorkPageShellProps) {
  const { navigate, motionProps } = useDissolveNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [navFloating, setNavFloating] = useState(false);

  return (
    <div ref={pageRef} className="work-page">
      <motion.div className="work-page__content" {...motionProps}>
        <div
          className={`work-page__nav-sticky${navFloating ? ' work-page__nav-sticky--floating' : ''}`}
        >
          <Navigation
            floatingGlass
            onFloatingChange={setNavFloating}
            mouseContainer={pageRef}
          />
        </div>
        <main id="main-content">
          <WorkPageContent
            bioText={bioText}
            projects={projects}
            onProjectNavigate={navigate}
          />
        </main>
      </motion.div>
    </div>
  );
}
