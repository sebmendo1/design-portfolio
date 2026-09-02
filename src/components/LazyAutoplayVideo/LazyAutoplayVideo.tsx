'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type VideoHTMLAttributes,
} from 'react';
import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import { acquireVideoSlot, releaseVideoSlot } from '@/lib/video-load-queue';
import './LazyAutoplayVideo.css';

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

type LazyAutoplayVideoProps = {
  src: string;
  srcMobile?: string;
  poster?: string;
  posterWidth?: number;
  posterHeight?: number;
  posterSizes?: string;
  className?: string;
  priority?: boolean;
  /** cover fills the parent (phones). intrinsic lets the poster set height (browser frames). */
  layout?: 'cover' | 'intrinsic';
  onLoadedMetadata?: VideoHTMLAttributes<HTMLVideoElement>['onLoadedMetadata'];
  onPosterLoad?: (naturalWidth: number, naturalHeight: number) => void;
};

function getNetworkConnection(): NetworkInformation | undefined {
  return (navigator as NavigatorWithConnection).connection;
}

function shouldSkipHeavyVideo(): boolean {
  const connection = getNetworkConnection();
  if (!connection) return false;
  if (connection.saveData) return true;
  return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
}

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function subscribeNarrowViewport(onChange: () => void) {
  const media = window.matchMedia('(max-width: 768px)');
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function subscribeConnection(onChange: () => void) {
  const connection = getNetworkConnection();
  connection?.addEventListener?.('change', onChange);
  return () => connection?.removeEventListener?.('change', onChange);
}

function useMediaFlag(
  subscribe: (onChange: () => void) => () => void,
  getSnapshot: () => boolean,
) {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function LazyAutoplayVideo({
  src,
  srcMobile,
  poster,
  posterWidth = 1280,
  posterHeight = 720,
  posterSizes = '(max-width: 768px) 100vw, 50vw',
  className,
  priority = false,
  layout = 'cover',
  onLoadedMetadata,
  onPosterLoad,
}: LazyAutoplayVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slotHeldRef = useRef(false);
  const queuedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [queuedLoad, setQueuedLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const prefersReducedMotion = useMediaFlag(subscribeReducedMotion, () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const isNarrowViewport = useMediaFlag(subscribeNarrowViewport, () =>
    window.matchMedia('(max-width: 768px)').matches,
  );
  const skipHeavyVideo = useMediaFlag(subscribeConnection, shouldSkipHeavyVideo);

  const constrained = prefersReducedMotion || skipHeavyVideo;
  const activeSrc = isNarrowViewport && srcMobile ? srcMobile : src;
  const shouldLoad = !constrained && (queuedLoad || (priority && isVisible));

  const releaseSlotIfHeld = useCallback(() => {
    if (!slotHeldRef.current) return;
    slotHeldRef.current = false;
    releaseVideoSlot();
  }, []);

  const tryPlay = useCallback(async () => {
    const element = videoRef.current;
    if (!element || !shouldLoad || !isVisible || constrained) return;

    try {
      if (element.readyState === 0) {
        element.load();
      }
      element.muted = true;
      await element.play();
    } catch {
      // Autoplay blocked or interrupted — poster remains visible until user interaction.
    }
  }, [constrained, isVisible, shouldLoad]);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          videoRef.current?.pause();
          releaseSlotIfHeld();
        }
      },
      { rootMargin: '80px', threshold: 0.15 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [releaseSlotIfHeld]);

  useEffect(() => {
    if (!isVisible || constrained || priority || queuedRef.current) return;

    let cancelled = false;
    const { promise, cancel } = acquireVideoSlot();
    void promise.then(() => {
      if (cancelled) {
        releaseVideoSlot();
        return;
      }
      slotHeldRef.current = true;
      queuedRef.current = true;
      setQueuedLoad(true);
    });

    return () => {
      cancelled = true;
      cancel();
    };
  }, [constrained, isVisible, priority]);

  useEffect(() => {
    if (!isVisible || !shouldLoad || constrained) return;
    void tryPlay();
  }, [activeSrc, constrained, isVisible, shouldLoad, tryPlay]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const element = videoRef.current;
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

  useEffect(() => () => releaseSlotIfHeld(), [releaseSlotIfHeld]);

  const handleCanPlay = () => {
    releaseSlotIfHeld();
    if (isVisible && !constrained) {
      void tryPlay();
    }
  };

  const mediaClassName = ['lazy-video__el', className].filter(Boolean).join(' ');
  const posterClassName = ['lazy-video__poster', className].filter(Boolean).join(' ');
  const wrapperClassName = [
    'lazy-video',
    isReady ? 'lazy-video--ready' : '',
    layout === 'intrinsic' ? 'lazy-video--intrinsic' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
    >
      <video
        ref={videoRef}
        className={mediaClassName}
        src={shouldLoad ? activeSrc : undefined}
        loop
        muted
        playsInline
        disablePictureInPicture
        preload={shouldLoad ? 'metadata' : 'none'}
        onLoadedMetadata={onLoadedMetadata}
        onCanPlay={handleCanPlay}
        onPlaying={() => setIsReady(true)}
      />
      {poster ? (
        <OptimizedImage
          src={poster}
          alt=""
          width={posterWidth}
          height={posterHeight}
          className={posterClassName}
          sizes={posterSizes}
          priority={priority}
          onLoadingComplete={
            onPosterLoad
              ? (img) => onPosterLoad(img.naturalWidth, img.naturalHeight)
              : undefined
          }
        />
      ) : null}
    </div>
  );
}
