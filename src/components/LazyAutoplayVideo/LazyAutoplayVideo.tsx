'use client';

import { useCallback, useEffect, useRef, useState, type VideoHTMLAttributes } from 'react';

type LazyAutoplayVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  onLoadedMetadata?: VideoHTMLAttributes<HTMLVideoElement>['onLoadedMetadata'];
};

export function LazyAutoplayVideo({
  src,
  poster,
  className,
  onLoadedMetadata,
}: LazyAutoplayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const tryPlay = useCallback(async () => {
    const element = ref.current;
    if (!element || !shouldLoad || !isVisible || prefersReducedMotion) return;

    try {
      if (element.readyState === 0) {
        element.load();
      }
      element.muted = true;
      await element.play();
    } catch {
      // Autoplay blocked or interrupted — poster remains visible until user interaction.
    }
  }, [isVisible, prefersReducedMotion, shouldLoad]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(media.matches);
    syncPreference();
    media.addEventListener('change', syncPreference);
    return () => media.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          setIsVisible(true);
        } else {
          setIsVisible(false);
          element.pause();
        }
      },
      { rootMargin: '200px', threshold: 0.01 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !shouldLoad || prefersReducedMotion) return;
    void tryPlay();
  }, [isVisible, prefersReducedMotion, shouldLoad, src, tryPlay]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const element = ref.current;
      if (!element) return;

      if (document.visibilityState === 'visible') {
        void tryPlay();
      } else {
        element.pause();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [tryPlay]);

  const handleCanPlay = () => {
    if (isVisible && !prefersReducedMotion) {
      void tryPlay();
    }
  };

  return (
    <video
      ref={ref}
      className={className}
      src={shouldLoad ? src : undefined}
      poster={poster}
      loop
      muted
      playsInline
      disablePictureInPicture
      preload={shouldLoad ? 'auto' : 'none'}
      onLoadedMetadata={onLoadedMetadata}
      onCanPlay={handleCanPlay}
    />
  );
}
