import Image from 'next/image';
import { BLOB_HOST } from '@/data/assets';

function stripQuery(src: string): string {
  return src.split('?')[0];
}

function isOptimizableRemote(src: string): boolean {
  try {
    const url = new URL(src);
    return url.hostname === BLOB_HOST;
  } catch {
    return false;
  }
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  onLoadingComplete?: (img: HTMLImageElement) => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
  fill,
  onLoadingComplete,
}: OptimizedImageProps) {
  const cleanSrc = stripQuery(src);

  if (fill) {
    return (
      <Image
        src={cleanSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes ?? '100vw'}
        priority={priority}
        unoptimized={!isOptimizableRemote(cleanSrc) && cleanSrc.endsWith('.svg')}
        onLoadingComplete={onLoadingComplete}
      />
    );
  }

  return (
    <Image
      src={cleanSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={cleanSrc.endsWith('.svg')}
      onLoadingComplete={onLoadingComplete}
    />
  );
}
