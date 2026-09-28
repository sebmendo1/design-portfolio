import Image from 'next/image';
import { HomeLogo } from '@/components/HomeProjectCard/HomeProjectCard';
import type { HomeSectionLogo } from '@/lib/home-sections';
import './HomeProjectCard.css';

type HomePhotoCardProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  logo?: HomeSectionLogo;
  priority?: boolean;
};

export function HomePhotoCard({
  src,
  alt,
  width,
  height,
  title,
  caption,
  logo,
  priority = false,
}: HomePhotoCardProps) {
  return (
    <figure className="home-card home-card--photo">
      <div className="home-card__link">
        <div className="home-card__media">
          <div className="home-card__stage">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="(max-width: 900px) 70vw, 420px"
              preload={priority}
              className="home-card__photo"
            />
          </div>
        </div>
        <figcaption className="home-card__meta">
          {logo ? <HomeLogo logo={logo} /> : null}
          <div className="home-card__text">
            <p className="home-card__title">{title}</p>
            <p className="home-card__description">{caption}</p>
          </div>
        </figcaption>
      </div>
    </figure>
  );
}
