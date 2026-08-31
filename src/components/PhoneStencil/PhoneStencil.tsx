'use client';

import { useRef, type CSSProperties } from 'react';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { LazyAutoplayVideo } from '@/components/LazyAutoplayVideo/LazyAutoplayVideo';
import { getVideoMobileSrc } from '@/data/assets';
import { DEFAULT_PHONE_SCREEN_AR } from './phone-aspect-ratios';
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
  priority?: boolean;
  lockAspectRatio?: boolean;
};

export function PhoneStencil({
  src,
  video,
  poster,
  alt,
  variant = 'case-study',
  className,
  priority = false,
}: PhoneStencilProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const screenW = usePhoneBodyWidth(rootRef);

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
      style={
        {
          '--content-ar': DEFAULT_PHONE_SCREEN_AR,
          ...(screenW ? { '--screen-w': `${screenW}px` } : {}),
        } as CSSProperties
      }
    >
      <div className="phone-stencil__body">
        <div className="phone-stencil__btn phone-stencil__btn--action" />
        <div className="phone-stencil__btn phone-stencil__btn--vol-up" />
        <div className="phone-stencil__btn phone-stencil__btn--vol-down" />
        <div className="phone-stencil__btn phone-stencil__btn--power" />
        <div className="phone-stencil__screen">
          {video ? (
            <LazyAutoplayVideo
              className="phone-stencil__media"
              src={video}
              srcMobile={getVideoMobileSrc(video)}
              poster={poster}
              posterWidth={786}
              posterHeight={1748}
              posterSizes={variant === 'card' ? '(max-width: 768px) 50vw, 33vw' : '50vw'}
              priority={priority}
            />
          ) : src ? (
            <OptimizedImage
              src={src}
              alt={alt}
              width={786}
              height={1748}
              className="phone-stencil__media"
              sizes={variant === 'card' ? '(max-width: 768px) 50vw, 33vw' : '50vw'}
            />
          ) : (
            <div className="phone-stencil__screen-fill" />
          )}
          <div className="phone-stencil__island" aria-hidden="true">
            <span className="phone-stencil__island-sensor phone-stencil__island-sensor--ir" />
            <span className="phone-stencil__island-sensor phone-stencil__island-sensor--camera" />
          </div>
          <div className="phone-stencil__home-indicator" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
