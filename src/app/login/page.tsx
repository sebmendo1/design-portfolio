import { siteLoginAction } from './actions';
import styles from './login.module.css';

interface Props {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}

export default async function SiteLoginPage({ searchParams }: Props) {
  const { error, redirect: redirectTo = '/' } = await searchParams;
  const hasError = Boolean(error);
  const safeRedirect =
    redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <h1 className={styles.title}>SebMendoDesign</h1>
        <p className={styles.subtitle}>Enter the site password to continue.</p>

        {hasError && (
          <p className={styles.error} role="alert">
            Incorrect password. Try again.
          </p>
        )}

        <form action={siteLoginAction}>
          <input type="hidden" name="redirect" value={safeRedirect} />
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="site-password">
              Password
            </label>
            <input
              id="site-password"
              className={`${styles.input}${hasError ? ` ${styles.inputError}` : ''}`}
              type="password"
              name="password"
              autoFocus
              autoComplete="current-password"
              aria-invalid={hasError}
              required
            />
          </div>
          <button type="submit" className={styles.submit}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
