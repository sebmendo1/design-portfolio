import { SITE_ADDRESS, SITE_CONTACT_EMAIL, SITE_LINKEDIN_URL, SITE_NAME } from '@/lib/site';

export const MIN_TRUST_PAGE_CHARS = 500;

export type TrustPage = {
  slug: '/contact' | '/privacy';
  title: string;
  description: string;
  paragraphs: string[];
};

export const CONTACT_PAGE: TrustPage = {
  slug: '/contact',
  title: 'Contact',
  description:
    'How to reach Sebastian Mendo for design collaboration, speaking, and recruiting.',
  paragraphs: [
    `Use ${SITE_CONTACT_EMAIL} for professional mail. This is a personal design practice, not a staffing agency or an intake form for Chase, Salesforce, or any past employer.`,
    'Write when you have a concrete job: a Senior / Staff-equivalent product design role in agentic AI, voice or conversational UX, or regulated consumer banking; a speaking or critique request; or a collaboration that needs the case studies on this site. Include the role or event, the timeline, and which project (Casey AI, Chase MyHome, Salesforce Help, Writer, Chorus, or Memento) you actually read.',
    `LinkedIn is ${SITE_LINKEDIN_URL}. Prefer email if you need a record or attachments. Work location is ${SITE_ADDRESS.addressLocality}, ${SITE_ADDRESS.addressRegion}, ${SITE_ADDRESS.addressCountry}. There is no public phone line and no chat widget.`,
    'I do not take unsolicited vendor pitches, student surveys without context, or requests to reverse-engineer internal bank systems. If the work is installing Seb Sans, skip this page and follow /seb-sans/llms.txt.',
    'Typical reply window is a few business days. If you do not hear back, the note was likely off-brief — tighten the ask and try once more.',
  ],
};

export const PRIVACY_PAGE: TrustPage = {
  slug: '/privacy',
  title: 'Privacy',
  description:
    'What this personal portfolio collects, what it does not, and how to ask questions.',
  paragraphs: [
    `This site is the personal portfolio of ${SITE_NAME}. It is hosted on Vercel. There is no customer account system, no store, and no newsletter. Visiting the public pages does not create a login.`,
    'Vercel may process standard request logs (IP address, user agent, path, and timing) to operate the CDN and defend against abuse. Vercel Analytics and Speed Insights measure aggregate traffic and performance. Those tools are not used to build an advertising profile or to sell your data.',
    'Case-study video and image files are served from Vercel Blob. The admin CMS at /admin is a private editor protected by a session cookie. That cookie is only set after a successful admin login and is not used on the public marketing pages. Site-password protection, when enabled on a preview host, also uses a session cookie.',
    'Machine-readable routes (/llms.txt, /llms-full.txt, /content.json, /.well-known/ai.txt) are public so agents can read the same facts as humans. They do not set tracking cookies. Markdown responses from Accept negotiation are the same public text in another representation.',
    `No data is sold. There are no third-party ad networks or social pixels on this site. To ask a privacy question or request deletion of something you sent by email, write ${SITE_CONTACT_EMAIL} from the same address you used. I cannot delete Vercel platform logs that I do not control.`,
  ],
};

export function trustPagePlainText(page: TrustPage): string {
  return [page.title, page.description, ...page.paragraphs].join(' ').replace(/\s+/g, ' ').trim();
}

export function trustPageMarkdown(page: TrustPage): string {
  return [`# ${page.title}`, '', page.description, '', ...page.paragraphs.flatMap((p) => [p, ''])].join(
    '\n',
  );
}
