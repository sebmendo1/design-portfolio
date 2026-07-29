'use client';

import { useState } from 'react';
import { FadeAppear } from '@/components/SebSans/FadeAppear';

const GLYPHS = [
  { char: 'G', name: 'distinct G in headings' },
  { char: '1', name: 'clear numerals in lists' },
  { char: 'l', name: 'readable lowercase rhythm' },
  { char: '0', name: 'clear numerals in tables' },
  { char: ',”', name: 'natural punctuation in prose' },
  { char: 'i·j', name: 'mid-dot for inline lists' },
];

export function GlyphInspector() {
  const [active, setActive] = useState(0);
  const glyph = GLYPHS[active];

  return (
    <section id="glyphs" className="section-block">
      <div className="section-inner">
        <div className="section-shell">
          <div className="content-grid">
            <FadeAppear className="section-heading">
              <span className="section-number">02 Specimen</span>
              <h2>Letterforms for long reads</h2>
            </FadeAppear>
            <FadeAppear className="section-copy" delay={120}>
              <p className="glyph-intro">
                Details that keep mixed-format AI output legible through long
                sessions — headings, lists, tables, and prose in one stream.
              </p>
            </FadeAppear>
          </div>

          <FadeAppear className="glyph-stage" delay={120}>
            <div className="glyph-display" aria-live="polite">
              <span
                className="glyph-char"
                style={{ fontVariationSettings: "'wght' 540, 'opsz' 32" }}
              >
                {glyph.char}
              </span>
              <span className="glyph-name">{glyph.name}</span>
            </div>

            <div className="glyph-grid" role="listbox" aria-label="Glyph set">
              {GLYPHS.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="option"
                  aria-selected={active === index}
                  className="glyph-cell"
                  onClick={() => setActive(index)}
                >
                  <span
                    className="glyph-cell-char"
                    style={{ fontVariationSettings: "'wght' 540, 'opsz' 28" }}
                  >
                    {item.char}
                  </span>
                  <span className="glyph-cell-name">{item.name}</span>
                </button>
              ))}
            </div>
          </FadeAppear>
        </div>
      </div>
    </section>
  );
}
