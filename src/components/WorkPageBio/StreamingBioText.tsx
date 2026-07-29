'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  splitIntoUnits,
  WORD_INTERVAL_MS,
} from '@/components/StreamingText/StreamingText';
import '@/components/StreamingText/StreamingText.css';
import { useLonelyLineWidth } from '@/hooks/useLonelyLineWidth';
import {
  WORK_PAGE_BIO,
  WORK_PAGE_BIO_CURRENT,
  WORK_PAGE_BIO_LEAD_PREFIX,
  WORK_PAGE_BIO_LINKS,
  WORK_PAGE_BIO_PREVIOUS_INTRO,
} from '@/lib/site';

type BioLinkMeta = {
  linkId: string;
  label: string;
  href: string;
};

type BioWordItem = {
  type: 'word';
  word: string;
  space: string;
};

type BioLinkWordItem = {
  type: 'linkWord';
  word: string;
  intraSpace: string;
  link: BioLinkMeta;
  wordIndex: number;
  linkWordCount: number;
  afterLinkSpace?: string;
};

type BioStreamItem = BioWordItem | BioLinkWordItem;

function appendLinkWords(
  items: BioStreamItem[],
  link: BioLinkMeta,
  afterLinkSpace: string,
) {
  const units = splitIntoUnits(link.label);
  units.forEach((unit, index) => {
    items.push({
      type: 'linkWord',
      word: unit.word,
      intraSpace:
        index < units.length - 1 ? unit.space.replace(/ /g, '\u00A0') : '',
      link,
      wordIndex: index,
      linkWordCount: units.length,
      afterLinkSpace: index === units.length - 1 ? afterLinkSpace : undefined,
    });
  });
}

function buildBioStreamItems(): BioStreamItem[] {
  const items: BioStreamItem[] = splitIntoUnits(WORK_PAGE_BIO_LEAD_PREFIX).map((unit) => ({
    type: 'word',
    word: unit.word,
    space: unit.space,
  }));

  appendLinkWords(
    items,
    {
      linkId: 'chase',
      label: WORK_PAGE_BIO_CURRENT.label,
      href: WORK_PAGE_BIO_CURRENT.href,
    },
    WORK_PAGE_BIO_PREVIOUS_INTRO,
  );

  WORK_PAGE_BIO_LINKS.forEach((link, index) => {
    const isLast = index === WORK_PAGE_BIO_LINKS.length - 1;
    const isSecondLast = index === WORK_PAGE_BIO_LINKS.length - 2;
    let afterLinkSpace = ' ';
    if (isLast) afterLinkSpace = '.';
    else if (isSecondLast) afterLinkSpace = '\u00A0and ';

    appendLinkWords(
      items,
      {
        linkId: link.label.toLowerCase().replace(/\s+/g, '-'),
        label: link.label,
        href: link.href,
      },
      afterLinkSpace,
    );
  });

  return items;
}

function BioWord({ item, visible }: { item: BioWordItem; visible: boolean }) {
  return (
    <span
      className={
        visible
          ? 'streaming-text__unit streaming-text__unit--visible'
          : 'streaming-text__unit streaming-text__unit--pending'
      }
    >
      <span className="streaming-text__word">{item.word}</span>
      {item.space}
    </span>
  );
}

function BioLinkGroup({
  group,
  startIndex,
  visibleCount,
}: {
  group: BioLinkWordItem[];
  startIndex: number;
  visibleCount: number;
}) {
  const isComplete = startIndex + group.length <= visibleCount;
  const hasStarted = startIndex < visibleCount;
  const unitClass = hasStarted
    ? 'streaming-text__unit streaming-text__unit--visible'
    : 'streaming-text__unit streaming-text__unit--pending';

  const { link } = group[0];

  return (
    <span className={unitClass}>
      <a
        href={link.href}
        className="work-page__bio-link"
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isComplete ? 0 : -1}
        aria-label={link.label}
      >
        <span className="work-page__bio-link-text">
          {group.map((part, index) => {
            const globalIndex = startIndex + index;
            const justRevealed = globalIndex === visibleCount - 1;

            return (
              <span key={`${part.word}-${index}`}>
                {index > 0 ? group[index - 1].intraSpace : ''}
                {justRevealed ? (
                  <span className="streaming-text__word">{part.word}</span>
                ) : (
                  part.word
                )}
              </span>
            );
          })}
          {isComplete ? <span aria-hidden="true"> ↗</span> : null}
        </span>
      </a>
      {group[group.length - 1].afterLinkSpace ?? null}
    </span>
  );
}

function renderBioStream(items: BioStreamItem[], visibleCount: number): ReactNode[] {
  const nodes: ReactNode[] = [];
  let index = 0;

  while (index < items.length) {
    const item = items[index];

    if (item.type === 'word') {
      nodes.push(
        <BioWord key={`word-${index}`} item={item} visible={index < visibleCount} />,
      );
      index += 1;
      continue;
    }

    const startIndex = index;
    const firstLinkItem = items[index];
    if (firstLinkItem.type !== 'linkWord') break;
    const linkId = firstLinkItem.link.linkId;

    const group: BioLinkWordItem[] = [];

    while (index < items.length) {
      const linkItem = items[index];
      if (linkItem.type !== 'linkWord' || linkItem.link.linkId !== linkId) break;
      group.push(linkItem);
      index += 1;
    }

    nodes.push(
      <BioLinkGroup
        key={`link-${linkId}-${startIndex}`}
        group={group}
        startIndex={startIndex}
        visibleCount={visibleCount}
      />,
    );
  }

  return nodes;
}

type StreamingBioTextProps = {
  onComplete?: () => void;
};

type StreamingBioTextInnerProps = {
  onComplete?: () => void;
  skipAnimation: boolean;
};

function StreamingBioTextInner({ onComplete, skipAnimation }: StreamingBioTextInnerProps) {
  const items = useMemo(() => buildBioStreamItems(), []);
  const [revealedCount, setRevealedCount] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);
  const streamStateRef = useRef<'idle' | 'running' | 'done'>('idle');

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    streamStateRef.current = 'idle';
    hasCompletedRef.current = false;

    if (skipAnimation) {
      streamStateRef.current = 'done';
      queueMicrotask(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onCompleteRef.current?.();
        }
      });
      return;
    }

    streamStateRef.current = 'running';

    let intervalId: ReturnType<typeof setInterval> | undefined;
    let count = 0;

    const finish = () => {
      streamStateRef.current = 'done';
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteRef.current?.();
      }
    };

    const tick = () => {
      count += 1;
      setRevealedCount(count);
      if (count >= items.length) {
        if (intervalId) clearInterval(intervalId);
        finish();
      }
    };

    const startTimeoutId = setTimeout(() => {
      if (items.length === 0) {
        finish();
        return;
      }

      setRevealedCount(0);
      tick();
      if (items.length > 1) {
        intervalId = setInterval(tick, WORD_INTERVAL_MS);
      }
    }, 0);

    return () => {
      clearTimeout(startTimeoutId);
      if (intervalId) clearInterval(intervalId);
      if (streamStateRef.current !== 'done') {
        streamStateRef.current = 'idle';
      }
    };
  }, [skipAnimation, items]);

  const visibleCount = skipAnimation ? items.length : revealedCount;
  const isStreamComplete = visibleCount >= items.length;
  const widthPercent = useLonelyLineWidth(
    headingRef,
    isStreamComplete ? visibleCount : -1,
  );

  return (
    <h1
      ref={headingRef}
      className="work-page__bio-text"
      style={{ '--work-page-bio-width': `${widthPercent}%` } as CSSProperties}
      aria-label={WORK_PAGE_BIO}
    >
      {renderBioStream(items, visibleCount)}
    </h1>
  );
}

export function StreamingBioText({ onComplete }: StreamingBioTextProps) {
  const shouldReduce = useReducedMotion();
  const skipAnimation = shouldReduce ?? false;

  return (
    <StreamingBioTextInner
      key={String(skipAnimation)}
      onComplete={onComplete}
      skipAnimation={skipAnimation}
    />
  );
}
