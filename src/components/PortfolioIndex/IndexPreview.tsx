'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { BrowserStencil } from '@/components/BrowserStencil/BrowserStencil';
import { DEFAULT_BROWSER_SCREEN_AR } from '@/components/BrowserStencil/browser-aspect-ratios';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import { DEFAULT_PHONE_SCREEN_AR } from '@/components/PhoneStencil/phone-aspect-ratios';
import { getVideoPoster } from '@/data/assets';
import type { PortfolioIndexEntry } from '@/data/portfolioIndex';
import type { ProjectPreview } from '@/data/projects';
import { getPortfolioIndexCta, isExternalPortfolioHref } from '@/lib/portfolio-index';
import type { ProjectCardSummary } from '@/lib/project-cards';

type IndexPreviewProps = {
  entry: PortfolioIndexEntry;
  project?: ProjectCardSummary;
  onNavigate?: (href: string) => void;
};

type PreviewFrame = {
  entry: PortfolioIndexEntry;
  project?: ProjectCardSummary;
};

const DISSOLVE_MS = 580;

function TypeSpecimen({ label }: { label: string }) {
  return (
    <div className="portfolio-index__specimen" aria-hidden="true">
      <p className="portfolio-index__specimen-word">Seb Sans</p>
      <p className="portfolio-index__specimen-meta">{label}</p>
    </div>
  );
}

function previewFrame(
  entry: PortfolioIndexEntry,
  project?: ProjectCardSummary,
): ProjectPreview['frame'] | undefined {
  if (entry.kind === 'typeface') return undefined;
  return entry.preview?.frame ?? project?.preview?.frame;
}

function DevicePreview({
  project,
  preview,
}: {
  project?: ProjectCardSummary;
  preview?: ProjectPreview;
}) {
  const resolved = preview ?? project?.preview;
  if (!resolved) return null;

  if (resolved.frame === 'phone') {
    const phones = [
      {
        src: resolved.src,
        video: resolved.video,
        screenAspectRatio: resolved.screenAspectRatio,
      },
      ...(resolved.companions ?? []),
    ];

    const nodes = phones.map((device, index) => (
      <PhoneStencil
        key={`${device.video ?? device.src ?? index}`}
        src={device.src}
        video={device.video}
        poster={device.video ? getVideoPoster(device.video) : undefined}
        alt={
          index === 0
            ? `${project?.title ?? 'Project'} preview`
            : `${project?.title ?? 'Project'} preview ${index + 1}`
        }
        screenAspectRatio={DEFAULT_PHONE_SCREEN_AR}
        lockAspectRatio
        variant="card"
        className="portfolio-index__device portfolio-index__device--phone"
        priority={index === 0}
      />
    ));

    if (nodes.length > 1) {
      return <div className="portfolio-index__phone-stack">{nodes}</div>;
    }

    return nodes[0] ?? null;
  }

  if (resolved.frame === 'browser') {
    return (
      <BrowserStencil
        src={resolved.src}
        video={resolved.video}
        poster={resolved.video ? getVideoPoster(resolved.video) : undefined}
        url={resolved.url}
        title={project?.title ?? resolved.url ?? 'Preview'}
        screenAspectRatio={resolved.screenAspectRatio ?? DEFAULT_BROWSER_SCREEN_AR}
        lockAspectRatio={!resolved.video}
        variant="card"
        className="portfolio-index__device portfolio-index__device--desktop"
        priority
      />
    );
  }

  if (resolved.frame === 'image' && resolved.src) {
    const contentAspectRatio = DEFAULT_BROWSER_SCREEN_AR;

    return (
      <div
        className="portfolio-index__image-wrap"
        style={{ '--content-ar': contentAspectRatio } as CSSProperties}
      >
        <OptimizedImage
          src={resolved.src}
          alt={project?.title ?? 'Preview'}
          width={1280}
          height={Math.round(1280 / contentAspectRatio)}
          className="portfolio-index__image"
          sizes="(max-width: 900px) 100vw, min(55vw, 800px)"
        />
      </div>
    );
  }

  if (resolved.frame === 'fill' && resolved.src) {
    return (
      <OptimizedImage
        src={resolved.src}
        alt={project?.title ?? 'Preview'}
        width={1200}
        height={800}
        className="portfolio-index__image--fill"
        sizes="(max-width: 900px) 100vw, min(55vw, 800px)"
      />
    );
  }

  return null;
}

function OpenProjectIcon() {
  return (
    <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
      <path
        d="M4 12 12 4M12 4H5M12 4v7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PreviewLayer({ frame }: { frame: PreviewFrame }) {
  return (
    <div className="portfolio-index__well-inner">
      <div className="portfolio-index__preview-slot">
        {frame.entry.kind === 'typeface' ? (
          <TypeSpecimen label={frame.entry.label} />
        ) : (
          <DevicePreview project={frame.project} preview={frame.entry.preview} />
        )}
      </div>
    </div>
  );
}

function PreviewWell({
  href,
  tint,
  label,
  summary,
  ctaLabel,
  phone,
  onNavigate,
  children,
}: {
  href?: string;
  tint: string;
  label: string;
  summary: string;
  ctaLabel?: string;
  phone?: boolean;
  onNavigate?: (href: string) => void;
  children: ReactNode;
}) {
  const className = [
    'portfolio-index__well',
    phone ? 'portfolio-index__well--phone' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const external = Boolean(href && isExternalPortfolioHref(href));
  const externalLinkProps = external
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};

  function handleOpen(event: MouseEvent<HTMLAnchorElement>) {
    if (!href || !onNavigate || external) return;
    event.preventDefault();
    onNavigate(href);
  }

  const stage = href ? (
    <a
      href={href}
      className="portfolio-index__well-device"
      aria-label={`Open ${label}`}
      onClick={handleOpen}
      {...externalLinkProps}
    >
      {children}
    </a>
  ) : (
    children
  );

  return (
    <div className={className} style={{ backgroundColor: tint }}>
      <div className="portfolio-index__well-bar">
        <p className="portfolio-index__well-summary">{summary}</p>
        {href && ctaLabel ? (
          <a
            href={href}
            className="portfolio-index__well-cta"
            onClick={handleOpen}
            {...externalLinkProps}
          >
            {ctaLabel}
            <OpenProjectIcon />
          </a>
        ) : null}
      </div>
      <div className="portfolio-index__well-stage">{stage}</div>
    </div>
  );
}

export function IndexPreview({
  entry,
  project,
  onNavigate,
}: IndexPreviewProps) {
  const cta = getPortfolioIndexCta(entry);
  const href = cta?.href;
  const ctaLabel = cta?.label;
  const [outgoing, setOutgoing] = useState<PreviewFrame | null>(null);
  const [current, setCurrent] = useState<PreviewFrame>({ entry, project });
  const currentRef = useRef(current);
  currentRef.current = current;

  useEffect(() => {
    const next = { entry, project };
    if (entry.id === currentRef.current.entry.id) {
      setCurrent(next);
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setOutgoing(null);
      setCurrent(next);
      return;
    }

    setOutgoing(currentRef.current);
    setCurrent(next);
    const timeoutId = window.setTimeout(() => setOutgoing(null), DISSOLVE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [entry, project]);

  return (
    <PreviewWell
      href={href}
      tint={entry.tint}
      label={entry.label}
      summary={entry.summary}
      ctaLabel={ctaLabel}
      phone={previewFrame(entry, project) === 'phone'}
      onNavigate={onNavigate}
    >
      {outgoing ? (
        <div className="portfolio-index__dissolve portfolio-index__dissolve--out" key={outgoing.entry.id}>
          <PreviewLayer frame={outgoing} />
        </div>
      ) : null}
      <div
        className={
          outgoing
            ? 'portfolio-index__dissolve portfolio-index__dissolve--in'
            : 'portfolio-index__dissolve'
        }
        key={current.entry.id}
      >
        <PreviewLayer frame={current} />
      </div>
    </PreviewWell>
  );
}
