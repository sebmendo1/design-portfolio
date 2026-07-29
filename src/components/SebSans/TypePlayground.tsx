'use client';

import { useState } from 'react';
import { FadeAppear } from '@/components/SebSans/FadeAppear';
import { TypewriterText } from '@/components/SebSans/TypewriterText';

const WEIGHTS = [
  { label: 'Thin', value: 130 },
  { label: 'Light', value: 330 },
  { label: 'Regular', value: 430 },
  { label: 'Medium', value: 530 },
  { label: 'Semi Bold', value: 620 },
  { label: 'Bold', value: 720 },
  { label: 'Black', value: 900 },
];

const SAMPLE =
  "Here's a concise summary of your request: Seb Sans is designed for products where most of what users read is generated — answers, drafts, tool results, and inline edits. The rhythm holds up in long sessions without feeling cold or clinical.";

const COMPARE = (
  <>
    Here&apos;s a concise summary of your request: Seb Sans is designed for
    products where most of what users read is{' '}
    <strong>generated</strong> — answers, drafts, tool results, and inline
    edits. The rhythm holds up in <strong>long sessions</strong> without feeling
    cold or clinical.
  </>
);

export function TypePlayground() {
  const [weight, setWeight] = useState(430);
  const [opsz, setOpsz] = useState(14);
  const [compareMode, setCompareMode] = useState<'seb' | 'sys'>('seb');

  return (
    <section id="playground" className="section-block">
      <div className="section-inner">
        <div className="section-shell">
          <FadeAppear className="section-heading">
            <h2>See it on AI output</h2>
          </FadeAppear>

          <FadeAppear className="playground-stage" delay={100}>
            <div
              className="playground-sample"
              style={{
                fontVariationSettings: `'wght' ${weight}, 'opsz' ${opsz}`,
              }}
            >
              <TypewriterText
                text={SAMPLE}
                speed={16}
                delay={300}
                showCursor={false}
              />
            </div>

            <div className="playground-controls">
              <div
                className="segmented segmented-wrap"
                role="radiogroup"
                aria-label="Weight presets"
              >
                {WEIGHTS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    role="radio"
                    aria-checked={weight === item.value}
                    className="segmented-item"
                    onClick={() => setWeight(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="playground-row">
                <label className="playground-field">
                  <span>Weight</span>
                  <input
                    type="range"
                    min={100}
                    max={900}
                    step={10}
                    value={weight}
                    onChange={(event) => setWeight(Number(event.target.value))}
                    aria-label="Weight axis"
                  />
                  <span className="mono">{weight}</span>
                </label>

                <div
                  className="segmented"
                  role="radiogroup"
                  aria-label="Optical size"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={opsz === 14}
                    className="segmented-item"
                    onClick={() => setOpsz(14)}
                  >
                    opsz 14
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={opsz === 32}
                    className="segmented-item"
                    onClick={() => setOpsz(32)}
                  >
                    opsz 32
                  </button>
                </div>
              </div>
            </div>
          </FadeAppear>

          <FadeAppear className="compare-stage" delay={200}>
            <div className="compare-head">
              <span>Side by side</span>
              <div
                className="segmented"
                role="radiogroup"
                aria-label="Compare typeface"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={compareMode === 'seb'}
                  className="segmented-item"
                  onClick={() => setCompareMode('seb')}
                >
                  Seb Sans
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={compareMode === 'sys'}
                  className="segmented-item"
                  onClick={() => setCompareMode('sys')}
                >
                  System
                </button>
              </div>
            </div>
            <div
              className={`compare-sample ${compareMode === 'sys' ? 'compare-system' : ''}`}
            >
              {compareMode === 'seb' ? (
                <TypewriterText
                  key="compare-seb"
                  text="Here's a concise summary of your request: Seb Sans is designed for products where most of what users read is generated — answers, drafts, tool results, and inline edits. The rhythm holds up in long sessions without feeling cold or clinical."
                  speed={12}
                  delay={200}
                  showCursor={false}
                />
              ) : (
                COMPARE
              )}
            </div>
            <p className="compare-note">
              The same AI-generated paragraph in Seb Sans vs your system UI font.
              Switch to see how rhythm and warmth change when users read model
              output all day.
            </p>
          </FadeAppear>
        </div>
      </div>
    </section>
  );
}
