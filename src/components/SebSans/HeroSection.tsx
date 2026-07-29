'use client';

import { HeroInstallZone } from '@/components/SebSans/HeroInstallZone';
import { TypewriterText } from '@/components/SebSans/TypewriterText';
import { FadeAppear } from '@/components/SebSans/FadeAppear';

const TAGLINE = 'A typeface designed for reading GenAI content.';

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="hero-crop hero-crop--tl" aria-hidden="true" />
      <div className="hero-crop hero-crop--br" aria-hidden="true" />

      <div className="hero-inner">
        <FadeAppear className="hero-headline" immediate>
          <h1 className="hero-title">Seb Sans</h1>
          <TypewriterText
            as="p"
            className="hero-tagline"
            text={TAGLINE}
            delay={400}
            speed={32}
          />
        </FadeAppear>

        <FadeAppear className="hero-install-zone" immediate delay={180}>
          <HeroInstallZone />
        </FadeAppear>
      </div>
    </section>
  );
}
