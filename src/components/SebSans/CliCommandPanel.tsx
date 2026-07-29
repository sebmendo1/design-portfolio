'use client';

import { useState } from 'react';
import { CopyButton } from '@/components/SebSans/CopyButton';
import {
  CLI_METHODS,
  INSTALL_COMMANDS,
  type InstallMethod,
} from '@/lib/seb-sans/install-commands';

export function CliCommandPanel() {
  const [active, setActive] = useState<InstallMethod>(CLI_METHODS[0]);
  const current = INSTALL_COMMANDS[active];

  return (
    <div className="install-instruction cli-panel">
      <nav
        className="cli-panel-nav"
        role="tablist"
        aria-label="CLI install command"
      >
        {CLI_METHODS.map((method) => (
          <button
            key={method}
            type="button"
            role="tab"
            aria-selected={active === method}
            className="cli-nav-item"
            onClick={() => setActive(method)}
          >
            {method}
          </button>
        ))}
      </nav>
      <div className="install-instruction-body cli-panel-body" key={active}>
        <div className="code-card">
          <div className="code-card-head">
            <span>
              {active === 'verify'
                ? 'Verify install'
                : `Install via ${active}`}
            </span>
            <CopyButton
              text={current.command}
              label="Copy"
              className="btn btn-copy"
            />
          </div>
          <pre className="code-block">
            <span className="code-prompt">{current.prompt} </span>
            {current.command}
          </pre>
          <p className="code-note">{current.note}</p>
        </div>
      </div>
    </div>
  );
}
