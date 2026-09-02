'use client';

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type AnimationEvent,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import Link from 'next/link';
import { PORTFOLIO_INDEX } from '@/data/portfolioIndex';
import { useIndexScroll } from '@/hooks/useIndexScroll';
import { SITE_SOCIAL_NAV } from '@/lib/site';
import {
  findPortfolioIndexEntry,
  groupPortfolioIndex,
  resolveIndexPreviewProject,
  resolvePortfolioIndexId,
} from '@/lib/portfolio-index';
import type { ProjectCardSummary } from '@/lib/project-cards';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { IndexPreview } from './IndexPreview';
import './PortfolioIndex.css';

const NARROW_QUERY = '(max-width: 900px)';

function subscribeNarrowViewport(onChange: () => void) {
  const media = window.matchMedia(NARROW_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function getNarrowViewportSnapshot() {
  return window.matchMedia(NARROW_QUERY).matches;
}

type PortfolioIndexProps = {
  bio: ReactNode;
  projects: ProjectCardSummary[];
  onNavigate?: (href: string) => void;
  initialPreviewId?: string;
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

export function PortfolioIndex({
  bio,
  projects,
  onNavigate,
  initialPreviewId,
}: PortfolioIndexProps) {
  const [activeId, setActiveId] = useState(() => resolvePortfolioIndexId(initialPreviewId));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);
  const isNarrow = useSyncExternalStore(
    subscribeNarrowViewport,
    getNarrowViewportSnapshot,
    () => false,
  );
  const layoutRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sections = useMemo(() => groupPortfolioIndex(PORTFOLIO_INDEX), []);
  const active = findPortfolioIndexEntry(activeId);
  const previewProject = resolveIndexPreviewProject(active, projects);
  useIndexScroll(layoutRef, railRef);

  useEffect(() => {
    if (!isNarrow) {
      setModalOpen(false);
      setModalMounted(false);
      dialogRef.current?.close();
    }
  }, [isNarrow]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !modalMounted) return;
    if (!dialog.open) dialog.showModal();
  }, [modalMounted]);

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function handleActivate(id: string) {
    setActiveId(id);
    if (!isNarrow) return;
    setModalMounted(true);
    setModalOpen(true);
  }

  function closeModal() {
    if (!modalOpen) return;
    if (prefersReducedMotion()) {
      setModalOpen(false);
      setModalMounted(false);
      dialogRef.current?.close();
      return;
    }
    setModalOpen(false);
  }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) closeModal();
  }

  function handleDialogCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    closeModal();
  }

  function handleDialogAnimationEnd(event: AnimationEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget || modalOpen) return;
    dialogRef.current?.close();
    setModalMounted(false);
  }

  const selectedId = !isNarrow || modalMounted ? active.id : null;
  const preview = (
    <IndexPreview
      entry={active}
      project={previewProject}
      onNavigate={onNavigate}
    />
  );

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
                          selected={item.id === selectedId}
                          onActivate={handleActivate}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>

          <nav className="portfolio-index__links" aria-label="Page">
            <Link href="/about" className="portfolio-index__link">
              about
            </Link>
            {SITE_SOCIAL_NAV.map((link) => (
              <a key={link.href} href={link.href} className="portfolio-index__link" rel="me">
                {link.label}
              </a>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </div>

      {!isNarrow ? (
        <div className="portfolio-index__pane portfolio-index__pane--stage">
          {preview}
        </div>
      ) : null}

      {isNarrow && modalMounted ? (
        <dialog
          ref={dialogRef}
          className={`portfolio-index__modal${modalOpen ? '' : ' is-leaving'}`}
          aria-label={active.label}
          onCancel={handleDialogCancel}
          onClick={handleDialogClick}
          onAnimationEnd={handleDialogAnimationEnd}
        >
          <div className="portfolio-index__modal-frame">
            <button
              type="button"
              className="portfolio-index__modal-close"
              aria-label="Close"
              onClick={closeModal}
            >
              <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
                <path
                  d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="portfolio-index__modal-well">{preview}</div>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
