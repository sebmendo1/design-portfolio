'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  DissolveIn,
  DISSOLVE_REVEAL_DURATION,
  DISSOLVE_REVEAL_EASE,
} from '@/components/DissolveIn/DissolveIn';
import { HomeMenu, HomeNavList, HomePageLinks } from '@/components/HomeNav/HomeNav';
import { HomeProjectCard } from '@/components/HomeProjectCard/HomeProjectCard';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { ScrollReveal } from '@/components/ScrollReveal/ScrollReveal';
import { IndexBio } from '@/components/WorkPageBio/IndexBio';
import { PORTFOLIO_INDEX } from '@/data/portfolioIndex';
import { useSectionSpy } from '@/hooks/useSectionSpy';
import { groupHomeSections } from '@/lib/home-sections';
import { resolveIndexPreviewProject } from '@/lib/portfolio-index';
import type { ProjectCardSummary } from '@/lib/project-cards';
import './HomeFeed.css';

type HomeFeedProps = {
  projects: ProjectCardSummary[];
  onNavigate?: (href: string) => void;
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function HomeFeed({ projects, onNavigate }: HomeFeedProps) {
  const sections = useMemo(() => groupHomeSections(), []);
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
  const { activeId, lock } = useSectionSpy(sectionIds);

  const scrollToSection = useCallback(
    (id: string) => {
      const node = document.getElementById(id);
      if (!node) return;
      lock(id);
      node.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      node.focus({ preventScroll: true });
      window.history.replaceState(null, '', `#${id}`);
    },
    [lock],
  );

  // Legacy `/?preview=<entry>` links from the previous index layout.
  useEffect(() => {
    const previewId = new URLSearchParams(window.location.search).get('preview');
    if (!previewId) return;
    const entry = PORTFOLIO_INDEX.find(
      (item) => item.id === previewId || item.previewSlug === previewId,
    );
    if (!entry) return;
    document
      .querySelector(`[data-entry-id="${CSS.escape(entry.id)}"]`)
      ?.scrollIntoView({ block: 'start' });
  }, []);

  const firstEntryId = sections[0]?.items[0]?.id;

  return (
    <div className="home-feed">
      <aside className="home-feed__sidebar">
        <header className="home-feed__header">
          <PageHeadline className="page-headline--home home-feed__headline" />
          <div className="home-feed__menu">
            <HomeMenu sections={sections} activeId={activeId} onSelect={scrollToSection} />
          </div>
        </header>
        <IndexBio className="home-feed__bio" />
        <nav aria-label="Projects" className="home-feed__nav">
          <p className="home-nav__label">Projects</p>
          <HomeNavList sections={sections} activeId={activeId} onSelect={scrollToSection} />
        </nav>
        <HomePageLinks className="home-feed__links" />
      </aside>

      <div className="home-feed__main">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="home-feed__section"
            aria-labelledby={`${section.id}-heading`}
            tabIndex={-1}
          >
            <h2 id={`${section.id}-heading`} className="sr-only">
              {section.label}
            </h2>
            {section.items.map((entry) => (
              <ScrollReveal key={entry.id} className="home-feed__card">
                {(revealed) => (
                  <DissolveIn
                    reveal={revealed}
                    duration={DISSOLVE_REVEAL_DURATION}
                    ease={DISSOLVE_REVEAL_EASE}
                  >
                    <HomeProjectCard
                      entry={entry}
                      project={resolveIndexPreviewProject(entry, projects)}
                      logo={section.logo}
                      priority={entry.id === firstEntryId}
                      onNavigate={onNavigate}
                    />
                  </DissolveIn>
                )}
              </ScrollReveal>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
