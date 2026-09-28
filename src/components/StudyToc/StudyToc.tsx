'use client';

import { useEffect, useRef, type MouseEvent } from 'react';
import { ACTIVATION_LINE } from '@/hooks/useSectionSpy';
import './StudyToc.css';

type TocSection = { id: string; label: string };

type StudyTocProps = {
  sections: TocSection[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

/** Share of the active section already read, measured against the spy's activation line. */
function sectionProgress(ids: string[], activeId: string): number {
  const index = ids.indexOf(activeId);
  const node = document.getElementById(activeId);
  if (index < 0 || !node) return 0;

  const scroller = document.documentElement;
  if (window.innerHeight + window.scrollY >= scroller.scrollHeight - 2) return 1;

  const line = window.innerHeight * ACTIVATION_LINE;
  const top = node.getBoundingClientRect().top;
  const nextNode = document.getElementById(ids[index + 1] ?? '');
  const end = nextNode ? nextNode.getBoundingClientRect().top : node.getBoundingClientRect().bottom;
  const span = end - top;
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (line - top) / span));
}

/**
 * Table of contents with a left track: passed sections stay filled, the
 * active row gets a segment, and a bar grows down it as that section is read.
 * Position is written to CSS variables every frame, so scrolling never
 * re-renders React.
 */
export function StudyToc({ sections, activeId, onSelect }: StudyTocProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const idsKey = sections.map((section) => section.id).join('|');

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ids = idsKey ? idsKey.split('|') : [];
    let frame = 0;

    const measure = () => {
      frame = 0;
      const id = activeId;
      const row = id ? list.querySelector<HTMLElement>(`[data-toc-id="${CSS.escape(id)}"]`) : null;
      if (!id || !row || row.offsetHeight === 0) return;

      const top = row.offsetTop;
      const height = row.offsetHeight;
      const progress = sectionProgress(ids, id);
      list.style.setProperty('--toc-active-y', `${top}px`);
      list.style.setProperty('--toc-active-h', `${height}px`);
      list.style.setProperty('--toc-progress', `${progress}`);
      list.style.setProperty('--toc-fill', `${top + height * progress}`);
      list.dataset.ready = 'true';
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    schedule();

    const resize = new ResizeObserver(schedule);
    resize.observe(list);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [idsKey, activeId]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    onSelect(id);
  }

  return (
    <div className="study-toc">
      <ol ref={listRef} className="study-toc__list">
        {sections.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id} className="study-toc__item" data-toc-id={section.id}>
              <a
                href={`#${section.id}`}
                className={`study-toc__link${active ? ' is-active' : ''}`}
                aria-current={active ? 'location' : undefined}
                onClick={(event) => handleClick(event, section.id)}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
