'use client';

import { useRef, type CSSProperties } from 'react';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { LazyAutoplayVideo } from '@/components/LazyAutoplayVideo/LazyAutoplayVideo';
import { useContentAspectRatio } from '@/components/PhoneStencil/useContentAspectRatio';
import { DEFAULT_BROWSER_SCREEN_AR } from './browser-aspect-ratios';
import { useBrowserFrameWidth } from './useBrowserFrameWidth';
import './browser-stencil.css';

type BrowserStencilProps = {
  src?: string;
  video?: string;
  poster?: string;
  url?: string;
  title: string;
  screenAspectRatio?: number;
  variant?: 'case-study' | 'card';
  className?: string;
};

export function BrowserStencil({
  src,
  video,
  poster,
  url,
  title,
  screenAspectRatio,
  variant = 'case-study',
  className,
}: BrowserStencilProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { aspectRatio, onVideoMetadata, onImageLoad } = useContentAspectRatio(
    screenAspectRatio ?? DEFAULT_BROWSER_SCREEN_AR,
  );
  useBrowserFrameWidth(rootRef);

  const rootClass = [
    'browser-stencil',
    variant === 'card' ? 'browser-stencil--card' : 'browser-stencil--case-study',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={rootRef}
      className={rootClass}
      style={{ '--content-ar': aspectRatio } as CSSProperties}
    >
      <div className="browser-stencil__chrome">
        <div className="browser-stencil__dots">
          <span className="browser-stencil__dot browser-stencil__dot--red" />
          <span className="browser-stencil__dot browser-stencil__dot--yellow" />
          <span className="browser-stencil__dot browser-stencil__dot--green" />
        </div>
        <div className="browser-stencil__nav">
          <svg className="browser-stencil__nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg className="browser-stencil__nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="browser-stencil__url-bar">
          <svg className="browser-stencil__lock" viewBox="0 0 12 14" fill="none" aria-hidden="true">
            <rect x="1.5" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M4 6V4a2 2 0 0 1 4 0v2"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="browser-stencil__url-text">{url ?? 'help.salesforce.com'}</span>
        </div>
        <div className="browser-stencil__spacer" />
      </div>
      <div className="browser-stencil__screen">
        {video ? (
          <LazyAutoplayVideo
            className="browser-stencil__media"
            src={video}
            poster={poster}
            onLoadedMetadata={onVideoMetadata}
          />
        ) : src ? (
          <OptimizedImage
            src={src}
            alt={`${title} interface screenshot`}
            width={1280}
            height={854}
            className="browser-stencil__media"
            sizes="50vw"
            onLoadingComplete={(img) => onImageLoad(img.naturalWidth, img.naturalHeight)}
          />
        ) : null}
      </div>
    </div>
  );
}
