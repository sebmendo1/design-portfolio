'use client';

import {
  DissolveIn,
  DISSOLVE_REVEAL_DURATION,
  DISSOLVE_REVEAL_EASE,
} from '@/components/DissolveIn/DissolveIn';
import { HomeMenu, HomePageLinks } from '@/components/HomeNav/HomeNav';
import { HomePhotoCard } from '@/components/HomeProjectCard/HomePhotoCard';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import { ScrollReveal } from '@/components/ScrollReveal/ScrollReveal';
import { StreamingText } from '@/components/StreamingText/StreamingText';
import { ABOUT_ALBUM } from '@/data/aboutAlbum';
import { ABOUT_INTRO_BLOCKS, buildAboutStreamPlan } from '@/lib/about-stream';
import { findHomeSection } from '@/lib/home-sections';
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
        <header className="home-feed__header">
          <PageHeadline className="page-headline--home home-feed__headline" />
          <div className="home-feed__menu">
            <HomeMenu page="about" />
          </div>
        </header>
        <AboutIntro />
        <HomePageLinks className="home-feed__links" page="about" />
      </aside>

      <section className="home-feed__main" aria-label="Photos">
        {ABOUT_ALBUM.map((photo, index) => (
          <ScrollReveal key={photo.src} className="home-feed__card">
            {(revealed) => (
              <DissolveIn
                reveal={revealed}
                duration={DISSOLVE_REVEAL_DURATION}
                ease={DISSOLVE_REVEAL_EASE}
              >
                <HomePhotoCard
                  {...photo}
                  logo={photo.logoSection ? findHomeSection(photo.logoSection)?.logo : undefined}
                  priority={index === 0}
                />
              </DissolveIn>
            )}
          </ScrollReveal>
        ))}
      </section>
    </div>
  );
}
