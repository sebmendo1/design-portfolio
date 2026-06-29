'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DissolveIn, DISSOLVE_STAGGER } from '@/components/DissolveIn/DissolveIn';
import { CaseStudyScrolly } from '@/components/CaseStudyScrolly/CaseStudyScrolly';
import { CaseyActions } from '@/components/CaseyActions/CaseyActions';
import { ProjectAboutBlock } from '@/components/ProjectAboutBlock/ProjectAboutBlock';
import { useDissolveNavigate } from '@/hooks/useDissolveNavigate';
import type { Project } from '@/data/projects';

type CaseStudyPageContentProps = {
  project: Project;
};

export function CaseStudyPageContent({ project }: CaseStudyPageContentProps) {
  const { navigate, motionProps } = useDissolveNavigate();

  return (
    <div className="case-study">
      <motion.div className="case-study__content" {...motionProps}>
        <DissolveIn className="case-study__header-reveal">
          <div className="case-study__header">
            <Link
              href="/"
              className="case-study__back"
              onClick={(event) => {
                event.preventDefault();
                navigate('/');
              }}
            >
              ← Go back
            </Link>
          </div>
        </DissolveIn>

        <DissolveIn className="case-study__main-reveal" delay={DISSOLVE_STAGGER}>
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
        </DissolveIn>
      </motion.div>
    </div>
  );
}
