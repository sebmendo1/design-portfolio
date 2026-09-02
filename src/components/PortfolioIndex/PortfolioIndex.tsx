'use client';

import {
  cloneElement,
  isValidElement,
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
import { useReducedMotion } from 'framer-motion';
import { PORTFOLIO_INDEX } from '@/data/portfolioIndex';
import { useIndexScroll } from '@/hooks/useIndexScroll';
import { buildIndexStreamDelays } from '@/lib/index-stream';
import { SITE_SOCIAL_NAV } from '@/lib/site';
import {
  findPortfolioIndexEntry,
  groupPortfolioIndex,
  resolveIndexPreviewProject,
  resolvePortfolioIndexId,
} from '@/lib/portfolio-index';
import type { ProjectCardSummary } from '@/lib/project-cards';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { StreamingText } from '@/components/StreamingText/StreamingText';
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

function useAfterDelay(startDelayMs: number) {
  const shouldReduce = useReducedMotion();
  const [ready, setReady] = useState(shouldReduce === true || startDelayMs <= 0);

  useEffect(() => {
    if (shouldReduce || startDelayMs <= 0) {
      setReady(true);
      return;
    }

    setReady(false);
    const timeoutId = window.setTimeout(() => setReady(true), startDelayMs);
    return () => window.clearTimeout(timeoutId);
  }, [shouldReduce, startDelayMs]);

  return shouldReduce === true || ready;
}

function IndexItem({
  id,
  label,
  selected,
  startDelayMs,
  intervalMs,
  onActivate,
}: {
  id: string;
  label: string;
  selected: boolean;
  startDelayMs: number;
  intervalMs: number;
  onActivate: (id: string) => void;
}) {
  const ready = useAfterDelay(startDelayMs);

  return (
    <button
      type="button"
      className={`portfolio-index__item${selected ? ' is-active' : ''}${ready ? '' : ' is-pending'}`}
      onClick={() => onActivate(id)}
      aria-pressed={selected}
      tabIndex={ready ? 0 : -1}
    >
      <StreamingText
        text={label}
        as="span"
        startDelayMs={startDelayMs}
        intervalMs={intervalMs}
      />
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
  const delays = useMemo(() => buildIndexStreamDelays(), []);
  const shouldReduce = useReducedMotion();
  const [wellVisible, setWellVisible] = useState(false);
  const active = findPortfolioIndexEntry(activeId);
  const previewProject = resolveIndexPreviewProject(active, projects);
  useIndexScroll(layoutRef, railRef);

  useEffect(() => {
    if (shouldReduce) {
      setWellVisible(true);
      return;
    }

    const timeoutId = window.setTimeout(() => setWellVisible(true), delays.wellFade);
    return () => window.clearTimeout(timeoutId);
  }, [delays.wellFade, shouldReduce]);

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
            <PageHeadline
              stream
              startDelayMs={delays.headline}
              intervalMs={delays.intervalMs}
            />
          </header>

          <div className="portfolio-index__intro">
            {isValidElement<{ startDelayMs?: number; intervalMs?: number }>(bio)
              ? cloneElement(bio, {
                  startDelayMs: delays.bio,
                  intervalMs: delays.intervalMs,
                })
              : bio}
          </div>

          <div className="portfolio-index__rail">
            {sections.map((section) => (
              <section
                key={section.id}
                className="portfolio-index__section"
                aria-labelledby={`index-${section.id}`}
              >
                <h2 id={`index-${section.id}`} className="portfolio-index__heading">
                  <StreamingText
                    text={section.id}
                    as="span"
                    startDelayMs={delays.headings[section.id] ?? 0}
                    intervalMs={delays.intervalMs}
                  />
                </h2>
                {section.years.map((group) => (
                  <div key={`${section.id}-${group.year}`} className="portfolio-index__year-row">
                    <p className="portfolio-index__year">
                      <StreamingText
                        text={String(group.year)}
                        as="span"
                        startDelayMs={delays.years[`${section.id}-${group.year}`] ?? 0}
                        intervalMs={delays.intervalMs}
                      />
                    </p>
                    <div className="portfolio-index__items">
                      {group.items.map((item) => (
                        <IndexItem
                          key={item.id}
                          id={item.id}
                          label={item.label}
                          selected={item.id === selectedId}
                          startDelayMs={delays.items[item.id] ?? 0}
                          intervalMs={delays.intervalMs}
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
              <StreamingText
                text="about"
                as="span"
                startDelayMs={delays.footer.about ?? 0}
                intervalMs={delays.intervalMs}
              />
            </Link>
            {SITE_SOCIAL_NAV.map((link) => (
              <a key={link.href} href={link.href} className="portfolio-index__link" rel="me">
                <StreamingText
                  text={link.label}
                  as="span"
                  startDelayMs={delays.footer[link.label] ?? 0}
                  intervalMs={delays.intervalMs}
                />
              </a>
            ))}
            <span
              className="portfolio-index__theme-stream"
              style={{ animationDelay: `${delays.theme}ms` }}
            >
              <ThemeToggle />
            </span>
          </nav>
        </div>
      </div>

      {!isNarrow ? (
        <div
          className={`portfolio-index__pane portfolio-index__pane--stage${wellVisible ? ' is-visible' : ''}`}
        >
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
