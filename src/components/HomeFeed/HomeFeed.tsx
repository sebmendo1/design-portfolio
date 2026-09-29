'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  DissolveIn,
  DISSOLVE_REVEAL_EASE,
  DISSOLVE_SUBTLE_BLUR,
  DISSOLVE_SUBTLE_DURATION,
  DISSOLVE_SUBTLE_OFFSET,
  DISSOLVE_SUBTLE_STAGGER,
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

// Only the cards likely above the fold on load follow the bio in sequence.
const STAGGERED_CARD_COUNT = 3;

const NO_SCRIPT_REVEAL =
  '.home-feed__dissolve{opacity:1!important;transform:none!important;filter:none!important}';

function FeedDissolve({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <ScrollReveal className={className}>
      {(revealed) => (
        <DissolveIn
          className="home-feed__dissolve"
          reveal={revealed}
          delay={delay}
          duration={DISSOLVE_SUBTLE_DURATION}
          ease={DISSOLVE_REVEAL_EASE}
          offset={DISSOLVE_SUBTLE_OFFSET}
          blur={DISSOLVE_SUBTLE_BLUR}
        >
          {children}
        </DissolveIn>
      )}
    </ScrollReveal>
  );
}

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
  const cardOrder = useMemo(
    () => new Map(sections.flatMap((section) => section.items).map((entry, i) => [entry.id, i])),
    [sections],
  );

  return (
    <div className="home-feed home-feed--home">
      <noscript>
        <style>{NO_SCRIPT_REVEAL}</style>
      </noscript>
      <aside className="home-feed__sidebar">
        <header className="home-feed__header">
          <PageHeadline className="page-headline--home home-feed__headline" />
          <div className="home-feed__menu">
            <HomeMenu sections={sections} activeId={activeId} onSelect={scrollToSection} />
          </div>
        </header>
        <FeedDissolve>
          <IndexBio className="home-feed__bio" />
        </FeedDissolve>
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
            {section.items.map((entry) => {
              const order = cardOrder.get(entry.id) ?? STAGGERED_CARD_COUNT;
              return (
                <FeedDissolve
                  key={entry.id}
                  className="home-feed__card"
                  delay={
                    order < STAGGERED_CARD_COUNT ? (order + 1) * DISSOLVE_SUBTLE_STAGGER : 0
                  }
                >
                  <HomeProjectCard
                    entry={entry}
                    project={resolveIndexPreviewProject(entry, projects)}
                    logo={section.logo}
                    priority={entry.id === firstEntryId}
                    onNavigate={onNavigate}
                  />
                </FeedDissolve>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
