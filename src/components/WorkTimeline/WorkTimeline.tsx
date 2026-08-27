import Link from 'next/link';
import { SHIPPED_WORK, type ShippedWorkEntry } from '@/data/shippedWork';
import './WorkTimeline.css';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

type TimelineRow = {
  entry: ShippedWorkEntry;
  year: string;
  showYear: boolean;
  monthLabel: string;
};

function getMonthLabel(entry: ShippedWorkEntry): string {
  if (entry.pending) {
    return 'Pending';
  }

  const monthIndex = Number(entry.sortDate.slice(5, 7)) - 1;
  return MONTH_NAMES[monthIndex] ?? entry.dateLabel;
}

function getTimelineRows(entries: readonly ShippedWorkEntry[]): TimelineRow[] {
  let lastYear = '';

  return entries.map((entry) => {
    const year = entry.sortDate.slice(0, 4);
    const showYear = year !== lastYear;
    lastYear = year;

    return {
      entry,
      year,
      showYear,
      monthLabel: getMonthLabel(entry),
    };
  });
}

export function WorkTimeline() {
  const rows = getTimelineRows(SHIPPED_WORK);

  return (
    <section className="work-timeline" aria-labelledby="work-timeline-heading">
      <h2 id="work-timeline-heading" className="work-timeline__heading">
        Timeline of work
      </h2>
      <div className="work-timeline__frame">
        <table className="work-timeline__table">
          <colgroup>
            <col className="work-timeline__col work-timeline__col--year" />
            <col className="work-timeline__col work-timeline__col--project" />
            <col className="work-timeline__col work-timeline__col--company" />
            <col className="work-timeline__col work-timeline__col--date" />
          </colgroup>
          <thead>
            <tr className="work-timeline__head">
              <th scope="col">Year</th>
              <th scope="col">Project</th>
              <th scope="col">Company</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ entry, year, showYear, monthLabel }) => (
              <tr
                key={entry.id}
                className={
                  showYear
                    ? 'work-timeline__row work-timeline__row--year-start'
                    : 'work-timeline__row'
                }
              >
                <td className="work-timeline__year">
                  {showYear ? year : <span className="sr-only">{year}</span>}
                </td>
                <th scope="row" className="work-timeline__title">
                  {entry.projectSlug ? (
                    <Link href={`/work/${entry.projectSlug}`}>{entry.title}</Link>
                  ) : (
                    entry.title
                  )}
                </th>
                <td className="work-timeline__affiliation">{entry.affiliation}</td>
                <td className="work-timeline__date">
                  {entry.pending ? (
                    <span className="work-timeline__date-value work-timeline__date-value--pending">
                      {monthLabel}
                    </span>
                  ) : (
                    <time
                      className="work-timeline__date-value"
                      dateTime={entry.sortDate}
                    >
                      {monthLabel}
                    </time>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
