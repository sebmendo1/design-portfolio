import { loginAction } from './actions';
import styles from '../admin.module.css';

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className={styles.loginRoot}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Portfolio CMS</h1>
        <p className={styles.loginSubtitle}>Enter your admin password to continue.</p>

        {error && (
          <p className={styles.loginError}>Incorrect password. Try again.</p>
        )}

        <form action={loginAction}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              className={styles.input}
              type="password"
              name="password"
              autoFocus
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className={styles.loginSubmit}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
