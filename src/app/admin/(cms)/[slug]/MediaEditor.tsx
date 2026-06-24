'use client';
import { useState } from 'react';
import styles from '../../admin.module.css';
import { saveMediaAction } from './actions';

type MediaState = {
  thumbnail: string;
  previewSrc: string;
  previewVideo: string;
  centerpieceSrc: string;
  centerpieceVideo: string;
};

type Status = 'idle' | 'saving' | 'saved' | 'error';

const FIELDS: Array<{ key: keyof MediaState; label: string }> = [
  { key: 'thumbnail', label: 'Thumbnail URL' },
  { key: 'previewSrc', label: 'Preview Image URL' },
  { key: 'previewVideo', label: 'Preview Video URL' },
  { key: 'centerpieceSrc', label: 'Centerpiece Image URL' },
  { key: 'centerpieceVideo', label: 'Centerpiece Video URL' },
];

export function MediaEditor({
  slug,
  initialMedia,
}: {
  slug: string;
  initialMedia: MediaState;
}) {
  const [media, setMedia] = useState(initialMedia);
  const [status, setStatus] = useState<Status>('idle');

  function setField(key: keyof MediaState, value: string) {
    setMedia((m) => ({ ...m, [key]: value }));
  }

  async function save() {
    setStatus('saving');
    const result = await saveMediaAction(slug, {
      thumbnail: media.thumbnail || undefined,
      preview: {
        src: media.previewSrc || undefined,
        video: media.previewVideo || undefined,
      },
      centerpiece: {
        src: media.centerpieceSrc || undefined,
        video: media.centerpieceVideo || undefined,
      },
    });
    if (result.success) {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } else {
      setStatus('error');
    }
  }

  return (
    <section className={styles.section}>
      <p className={styles.sectionTitle}>Media</p>

      <div className={styles.mediaGrid}>
        {FIELDS.map(({ key, label }) => (
          <div key={key} className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={`media-${key}`}>
              {label}
            </label>
            <input
              id={`media-${key}`}
              className={styles.input}
              value={media[key]}
              onChange={(e) => setField(key, e.target.value)}
              placeholder="https://…"
            />
          </div>
        ))}
      </div>

      <div className={styles.saveRow}>
        <button
          className={styles.saveBtn}
          onClick={save}
          disabled={status === 'saving'}
        >
          {status === 'saving' ? 'Saving…' : 'Save Media'}
        </button>
        {status === 'saved' && (
          <span className={`${styles.statusMsg} ${styles.statusSaved}`}>
            Saved
          </span>
        )}
        {status === 'error' && (
          <span className={`${styles.statusMsg} ${styles.statusError}`}>
            Error — try again
          </span>
        )}
      </div>
    </section>
  );
}
