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
  streamDurationMs,
  streamWordDelay,
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

function streamStyle(index: number, total: number, skip: boolean): CSSProperties {
  return {
    '--stream-at': `${skip ? 0 : streamWordDelay(index, total)}ms`,
  } as CSSProperties;
}

function unitClass(skip: boolean) {
  return skip
    ? 'streaming-text__unit streaming-text__unit--instant'
    : 'streaming-text__unit streaming-text__unit--streaming';
}

function BioWord({
  item,
  index,
  total,
  skip,
}: {
  item: BioWordItem;
  index: number;
  total: number;
  skip: boolean;
}) {
  return (
    <span className={unitClass(skip)} style={streamStyle(index, total, skip)}>
      <span className="streaming-text__word">{item.word}</span>
      {item.space}
    </span>
  );
}

function BioLinkGroup({
  group,
  startIndex,
  total,
  skip,
  interactive,
}: {
  group: BioLinkWordItem[];
  startIndex: number;
  total: number;
  skip: boolean;
  interactive: boolean;
}) {
  const { link } = group[0];
  const lastIndex = startIndex + group.length - 1;

  return (
    <span className="work-page__bio-link-group">
      <a
        href={link.href}
        className="work-page__bio-link"
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={interactive ? 0 : -1}
        aria-label={link.label}
      >
        <span className="work-page__bio-link-text">
          {group.map((part, index) => (
            <span key={`${part.word}-${index}`}>
              {index > 0 ? group[index - 1].intraSpace : ''}
              <span
                className={unitClass(skip)}
                style={streamStyle(startIndex + index, total, skip)}
              >
                <span className="streaming-text__word">{part.word}</span>
              </span>
            </span>
          ))}
          <span
            className={unitClass(skip)}
            style={streamStyle(lastIndex, total, skip)}
            aria-hidden="true"
          >
            <span className="streaming-text__word">&nbsp;↗</span>
          </span>
        </span>
      </a>
      {group[group.length - 1].afterLinkSpace ?? null}
    </span>
  );
}

function renderBioStream(
  items: BioStreamItem[],
  total: number,
  skip: boolean,
  interactive: boolean,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let index = 0;

  while (index < items.length) {
    const item = items[index];

    if (item.type === 'word') {
      nodes.push(
        <BioWord
          key={`word-${index}`}
          item={item}
          index={index}
          total={total}
          skip={skip}
        />,
      );
      index += 1;
      continue;
    }

    const startIndex = index;
    const linkId = item.link.linkId;
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
        total={total}
        skip={skip}
        interactive={interactive}
      />,
    );
  }

  return nodes;
}

type StreamingBioTextProps = {
  onComplete?: () => void;
};

export function StreamingBioText({ onComplete }: StreamingBioTextProps) {
  const shouldReduce = useReducedMotion();
  const skip = shouldReduce === true;
  const items = useMemo(() => buildBioStreamItems(), []);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [timedComplete, setTimedComplete] = useState(false);
  const complete = skip || items.length === 0 || timedComplete;
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Timing is CSS-scheduled; this single timer only reports the landing so
  // links become focusable and the lonely-line measurement can run.
  useEffect(() => {
    if (skip || items.length === 0) {
      queueMicrotask(() => onCompleteRef.current?.());
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTimedComplete(true);
      onCompleteRef.current?.();
    }, streamDurationMs(items.length));

    return () => window.clearTimeout(timeoutId);
  }, [skip, items]);

  const widthPercent = useLonelyLineWidth(headingRef, complete ? items.length : -1);

  return (
    <h1
      ref={headingRef}
      className="work-page__bio-text"
      style={{ '--work-page-bio-width': `${widthPercent}%` } as CSSProperties}
      aria-label={WORK_PAGE_BIO}
    >
      {renderBioStream(items, items.length, skip, skip || complete)}
    </h1>
  );
}
