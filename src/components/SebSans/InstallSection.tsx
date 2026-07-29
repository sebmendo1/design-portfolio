import { FadeAppear } from '@/components/SebSans/FadeAppear';
import { GITHUB_REPO } from '@/lib/seb-sans/install-commands';

export function InstallSection() {
  return (
    <section id="install-details" className="section-block">
      <div className="section-inner">
        <div className="section-shell">
          <FadeAppear className="section-heading">
            <span className="section-number">03 Install</span>
            <h2>How to install</h2>
            <p className="install-intro">
              Ship the same font in your app, your docs, and your agent&apos;s
              toolchain.
            </p>
          </FadeAppear>

          <FadeAppear delay={120}>
            <div
              className="feature-table"
              aria-label="Features by installation method"
            >
              <div className="feature-table-head">
                <span />
                <span>CLI</span>
                <span>Agent</span>
                <span>Download</span>
              </div>
              <div className="feature-table-row">
                <span>Non-interactive</span>
                <span>✓</span>
                <span>✓</span>
                <span>✓</span>
              </div>
              <div className="feature-table-row">
                <span>Idempotent</span>
                <span>✓</span>
                <span>✓</span>
                <span>✓</span>
              </div>
              <div className="feature-table-row">
                <span>Full glyph set</span>
                <span>✓</span>
                <span>—</span>
                <span>✓</span>
              </div>
              <div className="feature-table-row">
                <span>Typography skill</span>
                <span>—</span>
                <span>✓</span>
                <span>—</span>
              </div>
            </div>
          </FadeAppear>

          <FadeAppear delay={200}>
            <p className="install-foot">
              Package and installer live on{' '}
              <a href={GITHUB_REPO}>github.com/sebmendo1/seb-sans</a>. Licensed
              under SIL OFL 1.1.
            </p>
          </FadeAppear>
        </div>
      </div>
    </section>
  );
}
