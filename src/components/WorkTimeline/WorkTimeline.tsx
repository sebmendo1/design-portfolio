import Link from 'next/link';
import { SHIPPED_WORK, type ShippedWorkEntry } from '@/data/shippedWork';
import './WorkTimeline.css';

type TimelineYearGroup = {
  year: string;
  items: ShippedWorkEntry[];
};

function groupShippedWork(entries: readonly ShippedWorkEntry[]): TimelineYearGroup[] {
  const years: string[] = [];
  const byYear = new Map<string, ShippedWorkEntry[]>();

  for (const entry of entries) {
    const year = entry.sortDate.slice(0, 4);
    const existing = byYear.get(year);
    if (existing) {
      existing.push(entry);
    } else {
      byYear.set(year, [entry]);
      years.push(year);
    }
  }

  return years.map((year) => ({
    year,
    items: byYear.get(year) ?? [],
  }));
}

function TimelineItem({ entry }: { entry: ShippedWorkEntry }) {
  const meta = entry.pending ? `${entry.affiliation} · pending` : entry.affiliation;
  const title = entry.projectSlug ? (
    <Link href={`/work/${entry.projectSlug}`} className="work-timeline__title">
      {entry.title}
    </Link>
  ) : (
    <p className="work-timeline__title">{entry.title}</p>
  );

  return (
    <div className="work-timeline__item">
      {title}
      <p className="work-timeline__meta">{meta}</p>
    </div>
  );
}

export function WorkTimeline() {
  const groups = groupShippedWork(SHIPPED_WORK);

  return (
    <section className="work-timeline" aria-labelledby="work-timeline-heading">
      <h2 id="work-timeline-heading" className="work-timeline__heading">
        work
      </h2>
      {groups.map((group) => (
        <div key={group.year} className="work-timeline__year-row">
          <p className="work-timeline__year">{group.year}</p>
          <div className="work-timeline__items">
            {group.items.map((entry) => (
              <TimelineItem key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
