import Link from 'next/link';
import { SHIPPED_WORK } from '@/data/shippedWork';
import './WorkTimeline.css';

export function WorkTimeline() {
  return (
    <section className="work-timeline" aria-labelledby="work-timeline-heading">
      <h2 id="work-timeline-heading" className="work-timeline__heading">
        work
      </h2>
      <ol className="work-timeline__list">
        {SHIPPED_WORK.map((entry) => (
          <li key={entry.id} className="work-timeline__row">
            <span className="work-timeline__title">
              {entry.projectSlug ? (
                <Link href={`/work/${entry.projectSlug}`}>{entry.title}</Link>
              ) : (
                entry.title
              )}
            </span>
            <span className="sr-only"> </span>
            <span className="work-timeline__affiliation">{entry.affiliation}</span>
            <span className="sr-only"> </span>
            {entry.pending ? (
              <span className="work-timeline__date work-timeline__date--pending">Pending</span>
            ) : (
              <time className="work-timeline__date" dateTime={entry.sortDate}>
                {entry.dateLabel}
              </time>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
