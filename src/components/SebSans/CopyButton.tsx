'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/seb-sans/copy-to-clipboard';

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
};

export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  className = 'btn btn-primary btn-sm',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(text);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button type="button" className={className} onClick={handleCopy}>
      {copied ? copiedLabel : label}
    </button>
  );
}
