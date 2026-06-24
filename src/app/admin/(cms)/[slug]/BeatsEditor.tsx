'use client';
import { useState } from 'react';
import styles from '../../admin.module.css';
import { saveBeatsAction } from './actions';

type Beat = { id: string; label?: string; headline: string; body: string };

type Status = 'idle' | 'saving' | 'saved' | 'error';

export function BeatsEditor({
  slug,
  initialBeats,
}: {
  slug: string;
  initialBeats: Beat[];
}) {
  const [beats, setBeats] = useState(initialBeats);
  const [status, setStatus] = useState<Status>('idle');

  function updateBeat(id: string, field: 'headline' | 'body', value: string) {
    setBeats((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    );
  }

  async function save() {
    setStatus('saving');
    const result = await saveBeatsAction(
      slug,
      beats.map(({ id, headline, body }) => ({
        id,
        headline,
        body: body || undefined,
      })),
    );
    if (result.success) {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } else {
      setStatus('error');
    }
  }

  return (
    <section className={styles.section}>
      <p className={styles.sectionTitle}>Copy</p>

      {beats.map((beat) => (
        <div key={beat.id} className={styles.beatCard}>
          {beat.label && (
            <span className={styles.beatLabel}>{beat.label}</span>
          )}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={`beat-headline-${beat.id}`}>
              Headline
            </label>
            <input
              id={`beat-headline-${beat.id}`}
              className={styles.input}
              value={beat.headline}
              onChange={(e) => updateBeat(beat.id, 'headline', e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={`beat-body-${beat.id}`}>
              Body
            </label>
            <textarea
              id={`beat-body-${beat.id}`}
              className={styles.textarea}
              value={beat.body}
              onChange={(e) => updateBeat(beat.id, 'body', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      ))}

      <div className={styles.saveRow}>
        <button
          className={styles.saveBtn}
          onClick={save}
          disabled={status === 'saving'}
        >
          {status === 'saving' ? 'Saving…' : 'Save Copy'}
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
