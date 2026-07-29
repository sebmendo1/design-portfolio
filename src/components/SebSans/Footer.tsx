import { FadeAppear } from '@/components/SebSans/FadeAppear';
import { GITHUB_REPO } from '@/lib/seb-sans/install-commands';
import { SEB_SANS_BASE_PATH } from '@/lib/seb-sans/site-url';

export function Footer() {
  return (
    <footer className="site-footer section-block">
      <div className="section-inner">
        <div className="section-shell site-footer-inner">
          <FadeAppear className="footer-col" delay={0}>
            <span className="footer-label">Seb Sans</span>
            <span>v0.6</span>
            <span>Designed by Sebastian Mendo, 2026</span>
            <span>Dallas → San Francisco</span>
          </FadeAppear>
          <FadeAppear className="footer-col" delay={80}>
            <span className="footer-label">License</span>
            <span>SIL Open Font License 1.1</span>
            <span>Derived from Inter 4.1</span>
            <span>Renamed to avoid confusion with upstream Inter</span>
          </FadeAppear>
          <FadeAppear className="footer-col" delay={160}>
            <span className="footer-label">Source</span>
            <a href={GITHUB_REPO}>github.com/sebmendo1/seb-sans</a>
            <a href={`${SEB_SANS_BASE_PATH}/install.json`}>/install.json</a>
            <a href={`${SEB_SANS_BASE_PATH}/llms.txt`}>/llms.txt</a>
          </FadeAppear>
        </div>
      </div>
    </footer>
  );
}
