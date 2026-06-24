import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMergedProject } from '@/lib/cms-data';
import { BeatsEditor } from './BeatsEditor';
import { MediaEditor } from './MediaEditor';
import styles from '../../admin.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getMergedProject(slug);
  if (!project) notFound();

  const sc = project.scrollyConfig;

  const initialBeats =
    sc?.beats.map(({ id, label, headline, body }) => ({
      id,
      label,
      headline,
      body: body ?? '',
    })) ?? [];

  const initialMedia = {
    thumbnail: project.thumbnail ?? '',
    previewSrc: project.preview?.src ?? '',
    previewVideo: project.preview?.video ?? '',
    centerpieceSrc: sc?.stage.centerpiece.src ?? '',
    centerpieceVideo: sc?.stage.centerpiece.video ?? '',
  };

  return (
    <div className={styles.container}>
      <Link href="/admin" className={styles.backLink}>
        ← All Projects
      </Link>
      <h1 className={styles.pageTitle}>{project.title}</h1>

      {initialBeats.length > 0 && (
        <BeatsEditor slug={slug} initialBeats={initialBeats} />
      )}

      <MediaEditor slug={slug} initialMedia={initialMedia} />
    </div>
  );
}
