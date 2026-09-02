'use client';

import Link from 'next/link';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { StreamingText } from '@/components/StreamingText/StreamingText';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { ABOUT_INTRO_BLOCKS, buildAboutStreamDelays } from '@/lib/about-stream';
import { SITE_SOCIAL_NAV } from '@/lib/site';

const delays = buildAboutStreamDelays();

export function AboutIndexRail() {
  return (
    <>
      <header className="about-index__headline">
        <PageHeadline
          stream
          startDelayMs={delays.headline}
          intervalMs={delays.intervalMs}
        />
      </header>

      <div className="about-index__intro">
        {ABOUT_INTRO_BLOCKS.map((block, blockIndex) => {
          const Tag = block.key === 'title' ? 'h1' : 'p';
          const className =
            block.key === 'title' ? 'about-index__heading' : 'about-index__bio';
          const fullText = block.parts.map((part) => part.text).join('');

          return (
            <Tag key={block.key} className={className} aria-label={fullText}>
              {block.parts.map((part, partIndex) => {
                const leadingSpace = part.text.match(/^\s*/)?.[0] ?? '';
                const body = part.text.slice(leadingSpace.length);
                const text = body ? (
                  <StreamingText
                    text={body}
                    as="span"
                    startDelayMs={delays.blocks[blockIndex]?.[partIndex] ?? 0}
                    intervalMs={delays.intervalMs}
                  />
                ) : null;

                if (part.type === 'link') {
                  return (
                    <a
                      key={`${part.href}-${partIndex}`}
                      href={part.href}
                      className="about-index__bio-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {text}
                    </a>
                  );
                }

                return (
                  <span key={`text-${partIndex}`}>
                    {leadingSpace}
                    {text}
                  </span>
                );
              })}
            </Tag>
          );
        })}
      </div>

      <nav className="about-index__links" aria-label="Page">
        <Link href="/" className="about-index__link">
          <StreamingText
            text="work"
            as="span"
            startDelayMs={delays.footer.work ?? 0}
            intervalMs={delays.intervalMs}
          />
        </Link>
        {SITE_SOCIAL_NAV.map((link) => (
          <a key={link.href} href={link.href} className="about-index__link" rel="me">
            <StreamingText
              text={link.label}
              as="span"
              startDelayMs={delays.footer[link.label] ?? 0}
              intervalMs={delays.intervalMs}
            />
          </a>
        ))}
        <span
          className="about-index__theme-stream"
          style={{ animationDelay: `${delays.theme}ms` }}
        >
          <ThemeToggle />
        </span>
      </nav>
    </>
  );
}
