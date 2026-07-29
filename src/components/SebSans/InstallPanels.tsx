'use client';

import { CopyButton } from '@/components/SebSans/CopyButton';
import { FadeAppear } from '@/components/SebSans/FadeAppear';
import { useInstallMethod } from '@/components/SebSans/InstallMethodContext';
import { CliCommandPanel } from '@/components/SebSans/CliCommandPanel';
import {
  AGENT_PROMPT,
  FONTS_DOWNLOAD_URL,
  INSTALL_COMMANDS,
} from '@/lib/seb-sans/install-commands';

export function InstallPanels({
  variant = 'section',
}: {
  variant?: 'hero' | 'section';
}) {
  const { channel } = useInstallMethod();
  const compact = variant === 'hero';

  if (compact) {
    return (
      <div className="install-panels install-panels-hero">
        <FadeAppear className="command-card" immediate key={channel}>
          {channel === 'cli' ? (
            <div className="install-panel" id="install-cli" key="cli">
              <CliCommandPanel />
            </div>
          ) : null}

          {channel === 'agent' ? (
            <div className="install-panel" id="install-agent" key="agent">
              <div className="command-card-content">
                <div className="command-card-head">
                  <span>Install via Agent</span>
                  <CopyButton
                    text={AGENT_PROMPT}
                    label="Copy"
                    className="btn btn-copy"
                  />
                </div>
                <div className="command-card-divider" />
                <pre className="command-card-code">{AGENT_PROMPT}</pre>
              </div>
            </div>
          ) : null}

          {channel === 'download' ? (
            <div className="install-panel" id="install-download" key="download">
              <div className="command-card-content">
                <div className="command-card-head">
                  <span>Download for web</span>
                  <CopyButton
                    text={INSTALL_COMMANDS.download.command}
                    label="Copy"
                    className="btn btn-copy"
                  />
                </div>
                <div className="command-card-divider" />
                <pre className="command-card-code">
                  <span className="code-prompt">$ </span>
                  {INSTALL_COMMANDS.download.command}
                </pre>
                <p className="command-card-note">
                  {INSTALL_COMMANDS.download.note}
                </p>
                <div className="command-card-divider" />
                <div className="command-card-head">
                  <span>@font-face</span>
                  <CopyButton
                    text={INSTALL_COMMANDS.web.command}
                    label="Copy"
                    className="btn btn-copy"
                  />
                </div>
                <pre className="command-card-code">
                  {INSTALL_COMMANDS.web.command}
                </pre>
                <p className="command-card-note">{INSTALL_COMMANDS.web.note}</p>
                <a className="command-card-link" href={FONTS_DOWNLOAD_URL}>
                  Get files on GitHub ↗
                </a>
              </div>
            </div>
          ) : null}
        </FadeAppear>
      </div>
    );
  }

  return (
    <div className="install-panels">
      {channel === 'cli' ? (
        <div className="install-panel" id="install-cli" key="cli">
          <div className="panel-heading">
            <h3>Install via CLI</h3>
            <p>
              Non-interactive commands with JSON output — safe in scripts, CI,
              and agent loops.
            </p>
          </div>
          <div className="command-card">
            <CliCommandPanel />
          </div>
        </div>
      ) : null}

      {channel === 'agent' ? (
        <div className="install-panel" id="install-agent" key="agent">
          <div className="panel-heading">
            <h3>Install via Agent</h3>
            <p>
              Paste a prompt into Cursor, Claude Code, or any coding agent.
              Ships with a typography skill in the package.
            </p>
          </div>
          <div className="command-card">
            <div className="command-card-content">
              <div className="command-card-head">
                <span>Agent prompt</span>
                <CopyButton
                  text={AGENT_PROMPT}
                  label="Copy"
                  className="btn btn-copy"
                />
              </div>
              <div className="command-card-divider" />
              <pre className="command-card-code">{AGENT_PROMPT}</pre>
            </div>
          </div>
        </div>
      ) : null}

      {channel === 'download' ? (
        <div className="install-panel" id="install-download" key="download">
          <div className="panel-heading">
            <h3>Download files</h3>
            <p>
              Self-host the variable WOFF2 in your repo or copy font files
              directly from GitHub.
            </p>
          </div>
          <div className="command-card">
            <div className="command-card-content">
              <div className="command-card-head">
                <span>Web download</span>
                <CopyButton
                  text={INSTALL_COMMANDS.download.command}
                  label="Copy"
                  className="btn btn-copy"
                />
              </div>
              <div className="command-card-divider" />
              <pre className="command-card-code">
                <span className="code-prompt">$ </span>
                {INSTALL_COMMANDS.download.command}
              </pre>
              <p className="command-card-note">
                {INSTALL_COMMANDS.download.note}
              </p>
              <div className="command-card-divider" />
              <div className="command-card-head">
                <span>@font-face</span>
                <CopyButton
                  text={INSTALL_COMMANDS.web.command}
                  label="Copy"
                  className="btn btn-copy"
                />
              </div>
              <pre className="command-card-code">
                {INSTALL_COMMANDS.web.command}
              </pre>
              <p className="command-card-note">{INSTALL_COMMANDS.web.note}</p>
              <a className="command-card-link" href={FONTS_DOWNLOAD_URL}>
                Get files on GitHub ↗
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
