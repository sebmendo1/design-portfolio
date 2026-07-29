export type InstallMethod =
  | 'curl'
  | 'npx'
  | 'brew'
  | 'web'
  | 'download'
  | 'verify';

export type InstallCommand = {
  command: string;
  prompt: string;
  note: string;
};

export const GITHUB_REPO = 'https://github.com/sebmendo1/seb-sans';
export const SPECIMEN_URL =
  'https://sebmendo1.github.io/seb-sans/SebSans-Specimen.html';
export const FONTS_DOWNLOAD_URL =
  'https://github.com/sebmendo1/seb-sans/tree/main/package/fonts';
export const FONT_RELEASE_ZIP_URL =
  'https://github.com/sebmendo1/seb-sans/releases/download/v0.7.2/SebSans-v0.7.2.zip';

export const INSTALL_COMMANDS: Record<InstallMethod, InstallCommand> = {
  curl: {
    command:
      'curl -fsSL https://raw.githubusercontent.com/sebmendo1/seb-sans/main/install.sh | bash',
    prompt: '$',
    note: 'Installs all 12 cuts to ~/Library/Fonts (macOS) or ~/.local/share/fonts (Linux). Add --var-only for just the variable font.',
  },
  npx: {
    command: 'npx seb-sans-font install --with-skill',
    prompt: '$',
    note: 'Installs the OS font and typography skill for coding agents. Safe to rerun — idempotent JSON output.',
  },
  brew: {
    command: 'brew install --cask sebmendo1/tap/font-seb-sans',
    prompt: '$',
    note: 'The canonical macOS path. Updates flow through brew upgrade like everything else.',
  },
  web: {
    command:
      "@font-face { src: url('/fonts/SebSansVar.woff2') format('woff2'); font-weight: 100 900; font-display: swap; }",
    prompt: '»',
    note: 'Self-host the variable WOFF2 — one file, every weight and axis. Keep font-display: swap and a fallback stack.',
  },
  download: {
    command: 'npx seb-sans-font download --set web --dest ./public/fonts',
    prompt: '$',
    note: 'Copies SebSansVar.woff2 into your project. Checksum-verified JSON on stdout.',
  },
  verify: {
    command: 'npx seb-sans-font verify',
    prompt: '$',
    note: 'Checks the OS font registry and prints {"status":"ok","verified":true}. Exit 0 means installed and visible.',
  },
};

export const HERO_METHODS: InstallMethod[] = ['curl', 'npx', 'brew'];

export const CLI_METHODS: InstallMethod[] = ['curl', 'npx', 'brew', 'verify'];

export const AGENT_PROMPT = `Set Seb Sans as the typography for AI-generated UI content in this project.

1. Run: npx seb-sans-font install --with-skill
2. For web: npx seb-sans-font download --set web --dest ./public/fonts
3. Verify: npx seb-sans-font verify
4. Read node_modules/seb-sans-font/SKILL.md — it ships in the package and covers typography decisions (cut & weight by role, leading by size, measure caps, tabular figures, axes, icon pairing).

## The three principles (from SKILL.md)
1. Distinct at 13 pixels
2. Warmth is a detail, not a wobble
3. Rhythm before letterforms`;

export const SKILL_PATH = 'node_modules/seb-sans-font/SKILL.md';

export const SKILL_EXCERPT = `---
name: seb-sans-typography
description: Typography decisions for
  interfaces using Seb Sans — cut & weight
  by role, leading by size, measure caps,
  tabular figures, axes, icon pairing.
---

## The three principles
1. Distinct at 13 pixels
2. Warmth is a detail, not a wobble
3. Rhythm before letterforms`;

export const HERO_JSON_OUTPUT = `{"status":"ok","installed":12,"verified":true,"dest":"~/Library/Fonts"}`;
