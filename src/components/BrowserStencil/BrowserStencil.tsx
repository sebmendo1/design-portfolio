'use client';

import { useRef, type CSSProperties } from 'react';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { LazyAutoplayVideo } from '@/components/LazyAutoplayVideo/LazyAutoplayVideo';
import { getVideoMobileSrc } from '@/data/assets';
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
  priority?: boolean;
  lockAspectRatio?: boolean;
};

/** Host only — stencil chrome should read like a browser, not a full href. */
export function chromeUrlLabel(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  const withoutProtocol = trimmed.replace(/^[a-z]+:\/\//i, '');
  return withoutProtocol.split('/')[0] || trimmed;
}

export function BrowserStencil({
  src,
  video,
  poster,
  url,
  title,
  screenAspectRatio,
  variant = 'case-study',
  className,
  priority = false,
  lockAspectRatio = false,
}: BrowserStencilProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentAspectRatio = screenAspectRatio ?? DEFAULT_BROWSER_SCREEN_AR;
  const { aspectRatio, onVideoMetadata, onImageLoad } = useContentAspectRatio(
    contentAspectRatio,
    lockAspectRatio,
  );
  useBrowserFrameWidth(rootRef);

  const rootClass = [
    'browser-stencil',
    variant === 'card' ? 'browser-stencil--card' : 'browser-stencil--case-study',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const host = chromeUrlLabel(url);

  return (
    <div
      ref={rootRef}
      className={rootClass}
      style={{ '--content-ar': aspectRatio } as CSSProperties}
    >
      <div className="browser-stencil__chrome" aria-hidden="true">
        <div className="browser-stencil__leading">
          <div className="browser-stencil__dots">
            <span className="browser-stencil__dot browser-stencil__dot--red" />
            <span className="browser-stencil__dot browser-stencil__dot--yellow" />
            <span className="browser-stencil__dot browser-stencil__dot--green" />
          </div>
          <div className="browser-stencil__nav">
            <svg className="browser-stencil__nav-icon" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg className="browser-stencil__nav-icon" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="browser-stencil__url-bar" title={url || undefined}>
          <svg className="browser-stencil__lock" viewBox="0 0 12 14" fill="none">
            <rect x="1.5" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M4 6V4a2 2 0 0 1 4 0v2"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="browser-stencil__url-text">{host}</span>
          <span className="browser-stencil__url-balance" />
        </div>
      </div>
      <div className="browser-stencil__screen">
        {video ? (
          <LazyAutoplayVideo
            src={video}
            srcMobile={getVideoMobileSrc(video)}
            poster={poster}
            posterWidth={1280}
            posterHeight={Math.round(1280 / contentAspectRatio)}
            posterSizes={
              variant === 'card'
                ? '(max-width: 768px) 100vw, 50vw'
                : '(max-width: 900px) 100vw, 50vw'
            }
            priority={priority}
            layout="intrinsic"
            onLoadedMetadata={onVideoMetadata}
            onPosterLoad={onImageLoad}
          />
        ) : src ? (
          <OptimizedImage
            src={src}
            alt={`${title} interface screenshot`}
            width={1280}
            height={Math.round(1280 / contentAspectRatio)}
            className="browser-stencil__media"
            sizes={
              variant === 'card'
                ? '(max-width: 768px) 100vw, 50vw'
                : '(max-width: 900px) 100vw, 50vw'
            }
            onLoadingComplete={(img) => onImageLoad(img.naturalWidth, img.naturalHeight)}
          />
        ) : null}
      </div>
    </div>
  );
}
