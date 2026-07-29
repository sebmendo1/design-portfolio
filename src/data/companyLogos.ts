const LOGO_VERSION = '11';

const LOGO_PATHS: Record<string, string> = {
  'JPMorgan Chase': '/assets/logos/chase.png',
  Chase: '/assets/logos/chase.png',
  Salesforce: '/assets/logos/salesforce.png',
  'Writer AI': '/assets/logos/writer.webp',
  'Writer.com': '/assets/logos/writer.webp',
  WRITER: '/assets/logos/writer.webp',
  'Chorus AI': '/assets/logos/chorus-ai.png',
  'Chorus.ai': '/assets/logos/chorus-ai.png',
  Shift: '/assets/logos/shift.png',
};

export function getCompanyLogo(company?: string): string | undefined {
  if (!company) return undefined;
  const path = LOGO_PATHS[company];
  if (!path) return undefined;
  return `${path}?v=${LOGO_VERSION}`;
}
