'use client';

import { useRef, type CSSProperties } from 'react';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { LazyAutoplayVideo } from '@/components/LazyAutoplayVideo/LazyAutoplayVideo';
import { useContentAspectRatio } from './useContentAspectRatio';
import { usePhoneBodyWidth } from './usePhoneBodyWidth';
import './phone-stencil.css';

type PhoneStencilProps = {
  src?: string;
  video?: string;
  poster?: string;
  alt: string;
  screenAspectRatio?: number;
  variant?: 'case-study' | 'card';
  className?: string;
};

export function PhoneStencil({
  src,
  video,
  poster,
  alt,
  screenAspectRatio,
  variant = 'case-study',
  className,
}: PhoneStencilProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { aspectRatio, onVideoMetadata, onImageLoad } = useContentAspectRatio(screenAspectRatio);
  usePhoneBodyWidth(rootRef);

  const rootClass = [
    'phone-stencil',
    variant === 'card' ? 'phone-stencil--card' : 'phone-stencil--case-study',
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
      <div className="phone-stencil__body">
        <div className="phone-stencil__btn phone-stencil__btn--action" />
        <div className="phone-stencil__btn phone-stencil__btn--vol-up" />
        <div className="phone-stencil__btn phone-stencil__btn--vol-down" />
        <div className="phone-stencil__btn phone-stencil__btn--power" />
        <div className="phone-stencil__screen">
          <div className="phone-stencil__island" aria-hidden="true" />
          {video ? (
            <LazyAutoplayVideo
              className="phone-stencil__media"
              src={video}
              poster={poster}
              onLoadedMetadata={onVideoMetadata}
            />
          ) : src ? (
            <OptimizedImage
              src={src}
              alt={alt}
              width={786}
              height={1748}
              className="phone-stencil__media"
              sizes={variant === 'card' ? '(max-width: 768px) 50vw, 33vw' : '50vw'}
              onLoadingComplete={(img) => onImageLoad(img.naturalWidth, img.naturalHeight)}
            />
          ) : (
            <div className="phone-stencil__screen-fill" />
          )}
        </div>
      </div>
    </div>
  );
}
