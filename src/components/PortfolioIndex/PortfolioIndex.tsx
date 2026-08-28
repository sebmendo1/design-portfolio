'use client';

import { useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { PORTFOLIO_INDEX, PORTFOLIO_INDEX_DEFAULT_ID } from '@/data/portfolioIndex';
import { useIndexScroll } from '@/hooks/useIndexScroll';
import { SITE_CONTACT_EMAIL } from '@/lib/site';
import { findPortfolioIndexEntry, groupPortfolioIndex } from '@/lib/portfolio-index';
import type { ProjectCardSummary } from '@/lib/project-cards';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { IndexPreview } from './IndexPreview';
import './PortfolioIndex.css';

type PortfolioIndexProps = {
  bio: ReactNode;
  projects: ProjectCardSummary[];
  onNavigate?: (href: string) => void;
};

function IndexItem({
  id,
  label,
  selected,
  onActivate,
}: {
  id: string;
  label: string;
  selected: boolean;
  onActivate: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`portfolio-index__item${selected ? ' is-active' : ''}`}
      onClick={() => onActivate(id)}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

export function PortfolioIndex({ bio, projects, onNavigate }: PortfolioIndexProps) {
  const [activeId, setActiveId] = useState(PORTFOLIO_INDEX_DEFAULT_ID);
  const layoutRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const sections = useMemo(() => groupPortfolioIndex(PORTFOLIO_INDEX), []);
  const active = findPortfolioIndexEntry(activeId);
  const previewProject = projects.find((project) => project.slug === active.previewSlug);
  useIndexScroll(layoutRef, railRef);

  return (
    <div ref={layoutRef} className="portfolio-index">
      <div
        ref={railRef}
        className="portfolio-index__pane portfolio-index__pane--rail"
      >
        <div className="portfolio-index__pane-content">
          <header className="portfolio-index__headline">
            <PageHeadline />
          </header>

          <div className="portfolio-index__intro">
            {bio}

            <nav className="portfolio-index__links" aria-label="Page">
              <Link href="/about" className="portfolio-index__link">
                about
              </Link>
              <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="portfolio-index__link">
                contact
              </a>
            </nav>
          </div>

          <div className="portfolio-index__rail">
            {sections.map((section) => (
              <section
                key={section.id}
                className="portfolio-index__section"
                aria-labelledby={`index-${section.id}`}
              >
                <h2 id={`index-${section.id}`} className="portfolio-index__heading">
                  {section.id}
                </h2>
                {section.years.map((group) => (
                  <div key={`${section.id}-${group.year}`} className="portfolio-index__year-row">
                    <p className="portfolio-index__year">{group.year}</p>
                    <div className="portfolio-index__items">
                      {group.items.map((item) => (
                        <IndexItem
                          key={item.id}
                          id={item.id}
                          label={item.label}
                          selected={item.id === active.id}
                          onActivate={setActiveId}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>

      <div className="portfolio-index__pane portfolio-index__pane--stage">
        <IndexPreview
          entry={active}
          project={previewProject}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
