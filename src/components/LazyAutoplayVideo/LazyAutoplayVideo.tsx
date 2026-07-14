'use client';

import { useEffect, useRef, useState, type VideoHTMLAttributes } from 'react';

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

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          element.play().catch(() => undefined);
        } else {
          element.pause();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={shouldLoad ? src : undefined}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      onLoadedMetadata={onLoadedMetadata}
    />
  );
}
