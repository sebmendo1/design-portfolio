'use client';

import { useRef, useState } from 'react';
import { ASSETS } from '@/data/assets';
import './CaseyActions.css';

const SMS_NUMBER = '+14696639288';
const SMS_BODY = 'Hi Casey, I’m looking to learn more about buying a home with Chase';
const SMS_HREF = `sms:${SMS_NUMBER}?body=${encodeURIComponent(SMS_BODY)}`;

export function CaseyActions() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  }

  return (
    <div className="casey-actions">
      <audio
        ref={audioRef}
        src={ASSETS.audio.caseyIntro}
        onEnded={() => setPlaying(false)}
        preload="metadata"
      />

      <button
        className={`casey-btn casey-btn--listen${playing ? ' casey-btn--playing' : ''}`}
        onClick={toggleAudio}
        aria-label={playing ? 'Pause Casey' : 'Listen to Casey'}
      >
        {playing ? (
          <svg className="casey-btn__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
            <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg className="casey-btn__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 2.5a1 1 0 0 1 1.514-.857l8 5.5a1 1 0 0 1 0 1.714l-8 5.5A1 1 0 0 1 4 13.5v-11Z" fill="currentColor" />
          </svg>
        )}
        {playing ? 'Pause' : 'Listen to Casey'}
      </button>

      <a
        className="casey-btn casey-btn--text"
        href={SMS_HREF}
      >
        <svg className="casey-btn__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5.5L2 14V3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
        Text with Casey
      </a>
    </div>
  );
}
