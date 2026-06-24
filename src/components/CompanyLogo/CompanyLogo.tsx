import { OptimizedImage } from '@/components/OptimizedImage/OptimizedImage';
import './CompanyLogo.css';

interface CompanyLogoProps {
  src: string;
  alt?: string;
  size?: number;
}

export function CompanyLogo({ src, alt = '', size = 40 }: CompanyLogoProps) {
  return (
    <div
      className="company-logo"
      style={{ width: size, height: size }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="company-logo__img"
        sizes={`${size}px`}
      />
    </div>
  );
}
