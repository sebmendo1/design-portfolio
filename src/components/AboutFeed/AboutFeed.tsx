'use client';

import Image from 'next/image';
import { HomeMenu, HomePageLinks } from '@/components/HomeNav/HomeNav';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { StreamingText } from '@/components/StreamingText/StreamingText';
import { ABOUT_ALBUM } from '@/data/aboutAlbum';
import { ABOUT_INTRO_BLOCKS, buildAboutStreamPlan } from '@/lib/about-stream';
import { feedRevealSlot, revealSlot } from '@/lib/load-reveal';
import '@/components/HomeFeed/HomeFeed.css';

const plan = buildAboutStreamPlan();

function AboutIntro() {
  return (
    <div className="home-feed__bio about-feed__intro">
      {ABOUT_INTRO_BLOCKS.map((block, blockIndex) => {
        const isTitle = block.key === 'title';
        const Tag = isTitle ? 'h1' : 'p';
        const fullText = block.parts.map((part) => part.text).join('');

        return (
          <Tag
            key={block.key}
            className={isTitle ? 'about-feed__title' : 'home-bio'}
            aria-label={fullText}
          >
            {block.parts.map((part, partIndex) => {
              const leadingSpace = part.text.match(/^\s*/)?.[0] ?? '';
              const body = part.text.slice(leadingSpace.length);
              const text = body ? (
                <StreamingText
                  text={body}
                  as="span"
                  instant={isTitle}
                  startIndex={plan.blocks[blockIndex]?.[partIndex] ?? 0}
                  totalWords={plan.totalWords}
                  intervalMs={plan.intervalMs}
                />
              ) : null;

              return (
                <span key={`${block.key}-${partIndex}`}>
                  {leadingSpace}
                  {part.type === 'link' ? (
                    <a
                      href={part.href}
                      className="home-bio__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {text}
                    </a>
                  ) : (
                    text
                  )}
                </span>
              );
            })}
          </Tag>
        );
      })}
    </div>
  );
}

export function AboutFeed() {
  return (
    <div className="home-feed about-feed">
      <aside className="home-feed__sidebar">
        <header className="home-feed__header load-reveal">
          <PageHeadline className="page-headline--home home-feed__headline" />
          <div className="home-feed__menu">
            <HomeMenu page="about" />
          </div>
        </header>
        <HomePageLinks className="home-feed__links load-reveal" page="about" />
      </aside>

      <div className="home-feed__main">
        <AboutIntro />
        <section className="about-feed__photos" aria-label="Photos">
          {ABOUT_ALBUM.map((photo, index) => (
            <figure
              key={photo.src}
              className="about-photo load-reveal load-reveal--media"
              style={revealSlot(feedRevealSlot(index))}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 900px) calc(100vw - 30px), 600px"
                preload={index === 0}
                className="about-photo__image"
              />
            </figure>
          ))}
        </section>
      </div>
    </div>
  );
}
