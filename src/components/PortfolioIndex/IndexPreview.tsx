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
import { getPortfolioIndexHref } from '@/lib/portfolio-index';
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

function DevicePreview({ project }: { project: ProjectCardSummary }) {
  const preview = project.preview;
  if (!preview) return null;

  if (preview.frame === 'phone') {
    const poster = preview.video ? getVideoPoster(preview.video) : undefined;

    return (
      <PhoneStencil
        src={preview.src}
        video={preview.video}
        poster={poster}
        alt={`${project.title} preview`}
        screenAspectRatio={DEFAULT_PHONE_SCREEN_AR}
        lockAspectRatio
        variant="card"
        className="portfolio-index__device"
        priority
      />
    );
  }

  if (preview.frame === 'browser') {
    return (
      <BrowserStencil
        src={preview.src}
        video={preview.video}
        poster={preview.video ? getVideoPoster(preview.video) : undefined}
        url={preview.url}
        title={project.title}
        screenAspectRatio={DEFAULT_BROWSER_SCREEN_AR}
        lockAspectRatio
        variant="card"
        className="portfolio-index__device"
        priority
      />
    );
  }

  if (preview.frame === 'image' && preview.src) {
    const contentAspectRatio = DEFAULT_BROWSER_SCREEN_AR;

    return (
      <div
        className="portfolio-index__image-wrap"
        style={{ '--content-ar': contentAspectRatio } as CSSProperties}
      >
        <OptimizedImage
          src={preview.src}
          alt={project.title}
          width={1280}
          height={Math.round(1280 / contentAspectRatio)}
          className="portfolio-index__image"
          sizes="(max-width: 900px) 100vw, min(55vw, 800px)"
        />
      </div>
    );
  }

  if (preview.frame === 'fill' && preview.src) {
    return (
      <OptimizedImage
        src={preview.src}
        alt={project.title}
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
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
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
      {frame.entry.kind === 'typeface' ? (
        <TypeSpecimen label={frame.entry.label} />
      ) : frame.project ? (
        <DevicePreview project={frame.project} />
      ) : null}
    </div>
  );
}

function PreviewWell({
  href,
  tint,
  label,
  onNavigate,
  children,
}: {
  href?: string;
  tint: string;
  label: string;
  onNavigate?: (href: string) => void;
  children: ReactNode;
}) {
  const className = href
    ? 'portfolio-index__well portfolio-index__well--link'
    : 'portfolio-index__well';

  function handleOpen(event: MouseEvent<HTMLAnchorElement>) {
    if (!href || !onNavigate) return;
    event.preventDefault();
    onNavigate(href);
  }

  const body = (
    <>
      {href ? (
        <span className="portfolio-index__open" aria-hidden="true">
          <OpenProjectIcon />
        </span>
      ) : null}
      <div className="portfolio-index__well-stage">{children}</div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={className}
        style={{ backgroundColor: tint }}
        aria-label={`Open ${label}`}
        onClick={handleOpen}
      >
        {body}
      </a>
    );
  }

  return (
    <div className={className} style={{ backgroundColor: tint }}>
      {body}
    </div>
  );
}

export function IndexPreview({ entry, project, onNavigate }: IndexPreviewProps) {
  const href = getPortfolioIndexHref(entry);
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
    <PreviewWell href={href} tint={entry.tint} label={entry.label} onNavigate={onNavigate}>
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
