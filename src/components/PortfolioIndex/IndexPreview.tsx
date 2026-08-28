'use client';

import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrowserStencil } from '@/components/BrowserStencil/BrowserStencil';
import { DEFAULT_BROWSER_SCREEN_AR } from '@/components/BrowserStencil/browser-aspect-ratios';
import {
  DISSOLVE_EASE,
  DISSOLVE_REVEAL_EASE,
} from '@/components/DissolveIn/DissolveIn';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { PhoneStencil } from '@/components/PhoneStencil/PhoneStencil';
import { getVideoPoster } from '@/data/assets';
import type { PortfolioIndexEntry } from '@/data/portfolioIndex';
import { getPortfolioIndexHref } from '@/lib/portfolio-index';
import type { ProjectCardSummary } from '@/lib/project-cards';

type IndexPreviewProps = {
  entry: PortfolioIndexEntry;
  project?: ProjectCardSummary;
  onNavigate?: (href: string) => void;
};

const DISSOLVE_IN = {
  duration: 0.58,
  ease: DISSOLVE_REVEAL_EASE,
} as const;

const DISSOLVE_OUT = {
  duration: 0.36,
  ease: DISSOLVE_EASE,
} as const;

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
        screenAspectRatio={preview.screenAspectRatio}
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
        screenAspectRatio={preview.screenAspectRatio}
        variant="card"
        className="portfolio-index__device"
        priority
      />
    );
  }

  if (preview.frame === 'image' && preview.src) {
    const contentAspectRatio = preview.screenAspectRatio ?? DEFAULT_BROWSER_SCREEN_AR;

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

function PreviewLayer({
  entry,
  project,
}: {
  entry: PortfolioIndexEntry;
  project?: ProjectCardSummary;
}) {
  return (
    <div className="portfolio-index__well-inner">
      {entry.kind === 'typeface' ? (
        <TypeSpecimen label={entry.label} />
      ) : project ? (
        <DevicePreview project={project} />
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
  const shouldReduce = useReducedMotion();
  const className = href
    ? 'portfolio-index__well portfolio-index__well--link'
    : 'portfolio-index__well';

  function handleOpen(event: MouseEvent<HTMLAnchorElement>) {
    if (!href || !onNavigate) return;
    event.preventDefault();
    onNavigate(href);
  }

  const motionProps = {
    className,
    initial: false,
    animate: { backgroundColor: tint },
    transition: {
      duration: shouldReduce ? 0 : 0.55,
      ease: DISSOLVE_EASE,
    },
  };

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
      <motion.a
        href={href}
        aria-label={`Open ${label}`}
        onClick={handleOpen}
        {...motionProps}
      >
        {body}
      </motion.a>
    );
  }

  return <motion.div {...motionProps}>{body}</motion.div>;
}

export function IndexPreview({ entry, project, onNavigate }: IndexPreviewProps) {
  const shouldReduce = useReducedMotion();
  const href = getPortfolioIndexHref(entry);

  return (
    <PreviewWell href={href} tint={entry.tint} label={entry.label} onNavigate={onNavigate}>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={entry.id}
          className="portfolio-index__dissolve"
          initial={
            shouldReduce
              ? false
              : { opacity: 0, filter: 'blur(12px)', scale: 0.975 }
          }
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          exit={
            shouldReduce
              ? undefined
              : {
                  opacity: 0,
                  filter: 'blur(10px)',
                  scale: 1.02,
                  transition: DISSOLVE_OUT,
                }
          }
          transition={
            shouldReduce
              ? { duration: 0 }
              : {
                  opacity: { ...DISSOLVE_IN, duration: 0.46 },
                  filter: DISSOLVE_IN,
                  scale: { ...DISSOLVE_IN, duration: 0.62 },
                }
          }
        >
          <PreviewLayer entry={entry} project={project} />
        </motion.div>
      </AnimatePresence>
    </PreviewWell>
  );
}
