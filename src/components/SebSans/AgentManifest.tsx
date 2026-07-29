import { getAgentInstallManifest } from '@/lib/seb-sans/agent-manifest';
import { SEB_SANS_BASE_PATH } from '@/lib/seb-sans/site-url';

export function AgentInstallManifest() {
  const manifest = getAgentInstallManifest();

  return (
    <section
      id="agent-install-manifest"
      className="agent-manifest section-block"
      aria-label="Agent installation manifest"
      data-machine-readable="true"
      data-run-now={manifest.forAgents.runNow}
      data-verify={manifest.forAgents.verify.command}
      data-manifest-url={manifest.links.installJson}
    >
      <div className="section-inner">
        <div className="section-shell">
          <h2>Agent install manifest</h2>
          <p>{manifest.forAgents.instruction}</p>
          <p>{manifest.forAgents.whenReadingThisPage}</p>

          <h3>Run now</h3>
          <pre>
            <code>{manifest.forAgents.runNow}</code>
          </pre>

          <h3>Install steps</h3>
          <ol>
            {manifest.forAgents.steps.map((step) => (
              <li key={step.id} data-step={step.id} data-required={step.required}>
                <strong>{step.description}</strong>
                <pre>
                  <code>{step.command}</code>
                </pre>
              </li>
            ))}
          </ol>

          <h3>Verify</h3>
          <pre>
            <code>{manifest.forAgents.verify.command}</code>
          </pre>
          <p>
            Success: exit code {manifest.forAgents.verify.successExitCode}, stdout
            contains {manifest.forAgents.verify.successStdoutContains}. Example:{' '}
            <code>{manifest.forAgents.verify.exampleStdout}</code>
          </p>

          <h3>Agent prompt</h3>
          <pre data-agent-prompt="true">
            <code>{manifest.forAgents.prompt}</code>
          </pre>

          <h3>All install commands</h3>
          <dl className="agent-manifest-commands">
            {Object.entries(manifest.commands).map(([method, entry]) => (
              <div key={method}>
                <dt>{method}</dt>
                <dd>
                  <pre>
                    <code>{entry.command}</code>
                  </pre>
                  <p>{entry.note}</p>
                </dd>
              </div>
            ))}
          </dl>

          <h3>Machine-readable endpoints</h3>
          <ul>
            <li>
              <a href={`${SEB_SANS_BASE_PATH}/install.json`}>/install.json</a> — full install manifest
            </li>
            <li>
              <a href={`${SEB_SANS_BASE_PATH}/llms.txt`}>/llms.txt</a> — llms.txt for coding agents
            </li>
            <li>
              <a href={manifest.repository}>GitHub repository</a>
            </li>
            <li>
              <a href={manifest.fontsDownload}>Font files</a>
            </li>
          </ul>

          <p>
            Skill path after install:{' '}
            <code>{manifest.forAgents.skill.path}</code>
          </p>
        </div>
      </div>
    </section>
  );
}

export function AgentManifestScripts() {
  const manifest = getAgentInstallManifest();

  return (
    <>
      <script
        type="application/json"
        id="seb-sans-install-manifest"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(manifest.forAgents),
        }}
      />
    </>
  );
}
