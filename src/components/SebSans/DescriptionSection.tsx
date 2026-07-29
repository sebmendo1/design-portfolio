import { FadeAppear } from '@/components/SebSans/FadeAppear';

export function DescriptionSection() {
  return (
    <section id="design" className="section-block">
      <div className="section-inner">
        <div className="section-shell content-grid">
          <FadeAppear className="section-heading">
            <span className="section-number">01 Design</span>
            <h2>Built for AI-generated content</h2>
          </FadeAppear>
          <FadeAppear className="section-copy" delay={120}>
            <p>
              AI-native products surface mostly generated text: answers, drafts,
              tool results, and inline edits. Users read it in long sessions —
              and default system fonts fatigue before the content does.
            </p>
            <p>
              Seb Sans is a variable typeface tuned for streaming prose at UI
              sizes. Comfortable rhythm at 13–16px, clear hierarchy without
              shouting, warmth without noise. Built on Inter&apos;s open-source
              skeleton and shaped for chat transcripts, summaries, and
              mixed-format UI.
            </p>
            <p>
              Every install path is non-interactive and idempotent — safe in a
              script, in CI, or when a coding agent runs it twice. Ship the same
              typography in your app, your docs, and your agent toolchain.
            </p>
            <dl className="type-meta" aria-label="Typeface metadata">
              <div>
                <dt>Weights</dt>
                <dd>9 + variable</dd>
              </div>
              <div>
                <dt>Glyphs</dt>
                <dd>652</dd>
              </div>
              <div>
                <dt>Axes</dt>
                <dd>3</dd>
              </div>
              <div>
                <dt>UI range</dt>
                <dd>13–16px</dd>
              </div>
            </dl>
          </FadeAppear>
        </div>
      </div>
    </section>
  );
}
