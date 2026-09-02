import Image from 'next/image';
import Link from 'next/link';
import './PageHeadline.css';

type PageHeadlineProps = {
  href?: string;
  className?: string;
};

export function PageHeadline({ href = '/', className }: PageHeadlineProps) {
  return (
    <Link
      href={href}
      className={['page-headline', className].filter(Boolean).join(' ')}
      aria-label="SebMendoDesign home"
    >
      <span className="page-headline__avatar">
        <Image
          src="/assets/nav-avatar.png"
          alt=""
          width={36}
          height={36}
          className="page-headline__avatar-img"
          priority
        />
      </span>
      <span className="page-headline__text">SebMendoDesign</span>
    </Link>
  );
}
