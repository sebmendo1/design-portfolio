import {
  AgentInstallManifest,
  AgentManifestScripts,
} from '@/components/SebSans/AgentManifest';
import { InstallMethodProvider } from '@/components/SebSans/InstallMethodContext';
import { StickyNav } from '@/components/SebSans/StickyNav';
import { HeroSection } from '@/components/SebSans/HeroSection';
import { DescriptionSection } from '@/components/SebSans/DescriptionSection';
import { GlyphInspector } from '@/components/SebSans/GlyphInspector';
import { TypePlayground } from '@/components/SebSans/TypePlayground';
import { InstallSection } from '@/components/SebSans/InstallSection';
import { Footer } from '@/components/SebSans/Footer';
import { StructuredData } from '@/components/StructuredData/StructuredData';
import { getAgentHtmlComment, getJsonLd } from '@/lib/seb-sans/agent-manifest';

export default function SebSansPage() {
  const agentComment = getAgentHtmlComment();
  const jsonLd = getJsonLd();

  return (
    <div className="seb-sans">
      <StructuredData data={jsonLd} />
      <InstallMethodProvider>
        <StickyNav />
        <main className="page-main">
          <div
            aria-hidden="true"
            hidden
            dangerouslySetInnerHTML={{
              __html: `<!-- ${agentComment} -->`,
            }}
          />
          <div className="page-frame">
            <HeroSection />
            <DescriptionSection />
            <GlyphInspector />
            <TypePlayground />
            <InstallSection />
            <AgentInstallManifest />
            <Footer />
          </div>
        </main>
        <AgentManifestScripts />
      </InstallMethodProvider>
    </div>
  );
}
