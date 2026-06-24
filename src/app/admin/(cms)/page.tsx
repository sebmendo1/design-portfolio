import Link from 'next/link';
import { projects } from '@/data/projects';
import styles from '../admin.module.css';

export default function AdminPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Case Studies</h1>
      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/admin/${project.slug}`}
            className={styles.projectCard}
          >
            <p className={styles.projectCardTitle}>{project.title}</p>
            <p className={styles.projectCardSlug}>{project.slug}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
