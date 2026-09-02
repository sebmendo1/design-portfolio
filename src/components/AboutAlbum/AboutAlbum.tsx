import Image from 'next/image';
import { ABOUT_ALBUM } from '@/data/aboutAlbum';

export function AboutAlbum() {
  return (
    <div className="about-index__album" aria-label="Photos">
      {ABOUT_ALBUM.map((photo, index) => (
        <figure key={photo.src} className="about-index__photo">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 900px) calc(100vw - 32px), min(58vw, 932px)"
            preload={index === 0}
            className="about-index__photo-img"
          />
        </figure>
      ))}
    </div>
  );
}
