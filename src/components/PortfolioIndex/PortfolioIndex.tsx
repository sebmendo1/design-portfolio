'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { PORTFOLIO_INDEX, PORTFOLIO_INDEX_DEFAULT_ID } from '@/data/portfolioIndex';
import { SITE_CONTACT_EMAIL } from '@/lib/site';
import {
  findPortfolioIndexEntry,
  groupPortfolioIndex,
} from '@/lib/portfolio-index';
import type { ProjectCardSummary } from '@/lib/project-cards';
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
  href,
  selected,
  onActivate,
  onNavigate,
}: {
  id: string;
  label: string;
  href?: string;
  selected: boolean;
  onActivate: (id: string) => void;
  onNavigate?: (href: string) => void;
}) {
  const className = `portfolio-index__item${selected ? ' is-active' : ''}`;

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        onMouseEnter={() => onActivate(id)}
        onFocus={() => onActivate(id)}
        onClick={(event) => {
          if (!onNavigate) return;
          event.preventDefault();
          onNavigate(href);
        }}
        aria-current={selected ? 'true' : undefined}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onMouseEnter={() => onActivate(id)}
      onFocus={() => onActivate(id)}
      onClick={() => onActivate(id)}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

export function PortfolioIndex({ bio, projects, onNavigate }: PortfolioIndexProps) {
  const [activeId, setActiveId] = useState(PORTFOLIO_INDEX_DEFAULT_ID);
  const sections = useMemo(() => groupPortfolioIndex(PORTFOLIO_INDEX), []);
  const active = findPortfolioIndexEntry(activeId);
  const previewProject = projects.find((project) => project.slug === active.previewSlug);

  return (
    <div className="portfolio-index">
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

      <div className="portfolio-index__stage">
        <IndexPreview key={active.id} entry={active} project={previewProject} />
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
                      href={item.href}
                      selected={item.id === active.id}
                      onActivate={setActiveId}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
