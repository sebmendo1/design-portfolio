'use client';

import { useState, useCallback, type SyntheticEvent } from 'react';
import { DEFAULT_PHONE_SCREEN_AR } from './phone-aspect-ratios';

export function useContentAspectRatio(metadata?: number, lock = false) {
  const [detected, setDetected] = useState<number | null>(null);

  const aspectRatio = (lock ? metadata : detected ?? metadata) ?? DEFAULT_PHONE_SCREEN_AR;

  const onVideoMetadata = useCallback((e: SyntheticEvent<HTMLVideoElement>) => {
    if (lock) return;
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth > 0 && videoHeight > 0) {
      setDetected(videoWidth / videoHeight);
    }
  }, [lock]);

  const onImageLoad = useCallback((naturalWidth: number, naturalHeight: number) => {
    if (lock) return;
    if (naturalWidth > 0 && naturalHeight > 0) {
      setDetected(naturalWidth / naturalHeight);
    }
  }, [lock]);

  return { aspectRatio, onVideoMetadata, onImageLoad };
}
