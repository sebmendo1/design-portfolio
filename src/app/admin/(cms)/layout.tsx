import { logoutAction } from '../login/actions';
import styles from '../admin.module.css';

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.logo}>Portfolio CMS</span>
        <form action={logoutAction}>
          <button type="submit" className={styles.logoutBtn}>
            Log out
          </button>
        </form>
      </header>
      <main>{children}</main>
    </div>
  );
}
