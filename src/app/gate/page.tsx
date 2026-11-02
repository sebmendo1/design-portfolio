import { Suspense } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PageHeadline } from '@/components/PageHeadline/PageHeadline';
import {
  PROJECT_GATE_COOKIE,
  safeNextPath,
  verifyProjectGateToken,
} from '@/lib/project-gate';
import { unlockProjectGate } from './actions';
import styles from './gate.module.css';

export const metadata: Metadata = {
  title: { absolute: 'SebMendoDesign' },
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ error?: string; next?: string }>;
}

function GateError({ code }: { code: string | undefined }) {
  if (code !== '1' && code !== 'rate') return null;
  return (
    <p id="project-gate-error" className={styles.error} role="alert">
      {code === 'rate' ? 'Too many attempts. Try again shortly.' : 'Incorrect password.'}
    </p>
  );
}

function GateFields({ next, error }: { next: string; error?: string }) {
  const hasError = error === '1' || error === 'rate';
  return (
    <form className={styles.form} action={unlockProjectGate}>
      <input type="hidden" name="next" value={next} />
      <GateError code={error} />
      <div className={styles.row}>
        <label className="sr-only" htmlFor="project-gate-password">
          Password
        </label>
        <input
          id="project-gate-password"
          className={`${styles.input}${hasError ? ` ${styles.inputError}` : ''}`}
          type="password"
          name="password"
          placeholder="Password"
          autoFocus
          autoComplete="current-password"
          spellCheck={false}
          required
          aria-invalid={hasError}
          aria-describedby={hasError ? 'project-gate-error' : undefined}
          data-ready="true"
        />
        <button type="submit" className={styles.submit}>
          Continue
        </button>
      </div>
    </form>
  );
}

function GateShell({ next, error }: { next: string; error?: string }) {
  return (
    <div className={`${styles.page} gate-page`}>
      <header className={styles.header}>
        <PageHeadline className="page-headline--home" />
      </header>
      <main id="main-content" className={styles.main}>
        <GateFields next={next} error={error} />
      </main>
    </div>
  );
}

async function ProjectGateScreen({ searchParams }: Props) {
  const { error, next: nextParam } = await searchParams;
  const next = safeNextPath(nextParam);
  const token = (await cookies()).get(PROJECT_GATE_COOKIE)?.value;
  if (verifyProjectGateToken(token)) {
    redirect(next);
  }

  return <GateShell next={next} error={error} />;
}

function GateFallback() {
  return (
    <div className={`${styles.page} gate-page`}>
      <header className={styles.header}>
        <PageHeadline className="page-headline--home" />
      </header>
      <main className={styles.main} aria-busy="true" aria-label="Loading">
        <div className={styles.form} aria-hidden="true">
          <div className={styles.row}>
            <div className={styles.input} />
            <div className={styles.submit}>Continue</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProjectGatePage({ searchParams }: Props) {
  return (
    <Suspense fallback={<GateFallback />}>
      <ProjectGateScreen searchParams={searchParams} />
    </Suspense>
  );
}
