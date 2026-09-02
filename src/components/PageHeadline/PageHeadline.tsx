import Image from 'next/image';
import Link from 'next/link';
import { StreamingText } from '@/components/StreamingText/StreamingText';
import './PageHeadline.css';

const HEADLINE_TEXT = 'SebMendoDesign';

type PageHeadlineProps = {
  href?: string;
  className?: string;
  stream?: boolean;
  startDelayMs?: number;
  intervalMs?: number;
};

export function PageHeadline({
  href = '/',
  className,
  stream = false,
  startDelayMs = 0,
  intervalMs,
}: PageHeadlineProps) {
  return (
    <Link
      href={href}
      className={['page-headline', className].filter(Boolean).join(' ')}
      aria-label="SebMendoDesign home"
    >
      <span
        className={[
          'page-headline__avatar',
          stream ? 'page-headline__avatar--stream' : null,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Image
          src="/assets/nav-avatar.png"
          alt=""
          width={36}
          height={36}
          className="page-headline__avatar-img"
          priority
        />
      </span>
      {stream ? (
        <StreamingText
          text={HEADLINE_TEXT}
          as="span"
          className="page-headline__text"
          startDelayMs={startDelayMs}
          intervalMs={intervalMs}
        />
      ) : (
        <span className="page-headline__text">{HEADLINE_TEXT}</span>
      )}
    </Link>
  );
}
