import {
  WORK_PAGE_BIO,
  WORK_PAGE_BIO_CURRENT,
  WORK_PAGE_BIO_LEAD_PREFIX,
  WORK_PAGE_BIO_LINKS,
  WORK_PAGE_BIO_PREVIOUS_INTRO,
} from '@/lib/site';

type IndexBioPart =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; href: string };

const INDEX_BIO_PARTS: IndexBioPart[] = [
  { type: 'text', text: WORK_PAGE_BIO_LEAD_PREFIX },
  { type: 'link', text: WORK_PAGE_BIO_CURRENT.label, href: WORK_PAGE_BIO_CURRENT.href },
  { type: 'text', text: WORK_PAGE_BIO_PREVIOUS_INTRO },
  { type: 'link', text: WORK_PAGE_BIO_LINKS[0].label, href: WORK_PAGE_BIO_LINKS[0].href },
  { type: 'text', text: ', ' },
  { type: 'link', text: WORK_PAGE_BIO_LINKS[1].label, href: WORK_PAGE_BIO_LINKS[1].href },
  { type: 'text', text: ' and ' },
  { type: 'link', text: WORK_PAGE_BIO_LINKS[2].label, href: WORK_PAGE_BIO_LINKS[2].href },
  { type: 'text', text: '.' },
];

type IndexBioProps = {
  className?: string;
};

export function IndexBio({ className }: IndexBioProps) {
  return (
    <h1 className={['home-bio', className].filter(Boolean).join(' ')} aria-label={WORK_PAGE_BIO}>
      {INDEX_BIO_PARTS.map((part, index) =>
        part.type === 'link' ? (
          <a
            key={`${part.href}-${index}`}
            href={part.href}
            className="home-bio__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {part.text}
          </a>
        ) : (
          <span key={`text-${index}`}>{part.text}</span>
        ),
      )}
    </h1>
  );
}
