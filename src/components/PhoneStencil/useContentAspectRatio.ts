'use client';

import { useState, useCallback, type SyntheticEvent } from 'react';
import { DEFAULT_PHONE_SCREEN_AR } from './phone-aspect-ratios';

export function useContentAspectRatio(metadata?: number) {
  const [detected, setDetected] = useState<number | null>(null);

  const aspectRatio = detected ?? metadata ?? DEFAULT_PHONE_SCREEN_AR;

  const onVideoMetadata = useCallback((e: SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth > 0 && videoHeight > 0) {
      setDetected(videoWidth / videoHeight);
    }
  }, []);

  const onImageLoad = useCallback((naturalWidth: number, naturalHeight: number) => {
    if (naturalWidth > 0 && naturalHeight > 0) {
      setDetected(naturalWidth / naturalHeight);
    }
  }, []);

  return { aspectRatio, onVideoMetadata, onImageLoad };
}
