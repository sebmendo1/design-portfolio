import type { Metadata } from 'next';
import { getAgentInstallManifest } from '@/lib/seb-sans/agent-manifest';
import { SEB_SANS_BASE_PATH } from '@/lib/seb-sans/site-url';
import { canonicalPath, createMetadata } from '@/lib/metadata';
import './seb-sans.css';

const manifest = getAgentInstallManifest();

const SEB_SANS_TITLE = 'Seb Sans — readable type for AI-native products';
const SEB_SANS_DESCRIPTION =
  'A variable typeface tuned for AI-generated content — answers, drafts, summaries, and streamed UI copy. Easier to read and process. Install: npx seb-sans-font install --with-skill';

export const metadata: Metadata = createMetadata({
  ...canonicalPath(SEB_SANS_BASE_PATH),
  title: SEB_SANS_TITLE,
  description: SEB_SANS_DESCRIPTION,
  applicationName: 'Seb Sans',
  other: {
    'seb-sans:install-command': manifest.forAgents.runNow,
    'seb-sans:verify-command': manifest.forAgents.verify.command,
    'seb-sans:agent-instruction': manifest.forAgents.instruction,
    'seb-sans:install-manifest': manifest.links.installJson,
  },
  openGraph: {
    title: SEB_SANS_TITLE,
    description: SEB_SANS_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SEB_SANS_TITLE,
    description: SEB_SANS_DESCRIPTION,
  },
  alternates: {
    canonical: SEB_SANS_BASE_PATH,
    types: {
      'application/json': [
        {
          url: `${SEB_SANS_BASE_PATH}/install.json`,
          title: 'Seb Sans install manifest',
        },
      ],
      'text/plain': [
        {
          url: `${SEB_SANS_BASE_PATH}/llms.txt`,
          title: 'Seb Sans llms.txt',
        },
      ],
    },
  },
});

export default function SebSansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
