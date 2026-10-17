/**
 * Date formatting that renders the same on the server and in the browser.
 *
 * Pages are server-rendered in UTC and hydrated in the visitor's timezone.
 * A bare `toLocaleDateString()` can print a different day (or a different
 * locale's format) in each place; React then discards the server HTML and
 * re-renders the page (hydration error #418, first fixed on /insights).
 *
 * - Calendar dates (due dates, milestones, time-entry days) are stored as
 *   midnight UTC by `<input type="date">` and mean "that day" everywhere, so
 *   they are formatted in UTC: formatDate / formatShortDate.
 * - Timestamps (created, accepted, paid) belong in the viewer's own timezone:
 *   render them with <LocalTime> (components/ui/local-time.tsx), which prints
 *   UTC during SSR and swaps in local time after hydration.
 */

const LOCALE = "en-US";
const DAY_MS = 24 * 60 * 60 * 1000;

const asDate = (value: string | Date) => (value instanceof Date ? value : new Date(value));

/** "Oct 17, 2026" — for calendar dates. */
export function formatDate(value: string | Date): string {
  return asDate(value).toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** "Oct 17" — for calendar dates in tight spaces (task cards, week ranges). */
export function formatShortDate(value: string | Date): string {
  return asDate(value).toLocaleDateString(LOCALE, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Timestamp formatting in a given timezone; LocalTime uses it for both passes. */
export function formatTimestamp(
  value: string | Date,
  { withTime = false, timeZone }: { withTime?: boolean; timeZone?: string } = {},
): string {
  const d = asDate(value);
  return withTime
    ? d.toLocaleString(LOCALE, { dateStyle: "medium", timeStyle: "short", timeZone })
    : d.toLocaleDateString(LOCALE, { year: "numeric", month: "short", day: "numeric", timeZone });
}

/** Monday 00:00 UTC of the week containing `date` — matches how time-entry days are stored. */
export function startOfUtcWeek(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0 = Sunday
  return new Date(d.getTime() - (day === 0 ? 6 : day - 1) * DAY_MS);
}

export function addUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}
