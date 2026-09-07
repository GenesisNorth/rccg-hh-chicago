/**
 * Date rendering for statically-authored content (content/events.ts, content/sermons.ts).
 *
 * Why this exists instead of `new Date(str).toLocaleString()`:
 *
 * The dates in our content files are *wall-clock church time* — "2026-09-06T10:00:00"
 * means 10am in Grayslake, full stop. But `new Date("2026-09-06T10:00:00")` parses a
 * timezone-less string as the *runtime's* local time. The server (UTC in production)
 * and the visitor's browser (Central, Pacific, wherever) therefore build different
 * instants and render different strings — which React reports as a hydration mismatch,
 * and which shows visitors the wrong service time.
 *
 * So we never let the runtime's timezone touch these strings. We read the calendar
 * parts out of the text, rebuild them as a UTC instant, and format in UTC. The output
 * is byte-identical on the server and in every browser, and always says what the
 * church actually typed.
 */

interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

/** Reads "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM(:SS)" without any timezone interpretation. */
function parseParts(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(value.trim());
  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] ?? 0),
    minute: Number(match[5] ?? 0),
  };
}

/** The parts as a UTC instant, so Intl with timeZone:"UTC" echoes them back unchanged. */
function toUtcInstant(parts: DateParts): Date {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute));
}

function formatWith(value: string, options: Intl.DateTimeFormatOptions): string {
  const parts = parseParts(value);
  if (!parts) return value;
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(toUtcInstant(parts));
}

/** "Sunday, September 6" */
export const formatLongDate = (value: string) =>
  formatWith(value, { weekday: "long", month: "long", day: "numeric" });

/** "September 6, 2026" */
export const formatDate = (value: string) =>
  formatWith(value, { month: "long", day: "numeric", year: "numeric" });

/** "10:00 AM" */
export const formatTime = (value: string) =>
  formatWith(value, { hour: "numeric", minute: "2-digit", hour12: true });

/** "SEP" / "6" — the calendar chip on an event card. */
export const formatMonthAbbr = (value: string) => formatWith(value, { month: "short" }).toUpperCase();
export const formatDayOfMonth = (value: string) => formatWith(value, { day: "numeric" });

/**
 * Whether the wall-clock date has passed, in the *viewer's* timezone.
 *
 * This depends on the current time, so it differs between the server render and the
 * browser render. Never call it during the first client render — gate it behind a
 * mounted flag (see app/events/page.tsx) so hydration matches, then apply it.
 */
export function hasPassed(value: string): boolean {
  const parts = parseParts(value);
  if (!parts) return false;
  return (
    new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute).getTime() < Date.now()
  );
}

/** Sort key that ignores timezone entirely. */
export function sortKey(value: string): number {
  const parts = parseParts(value);
  return parts ? toUtcInstant(parts).getTime() : 0;
}
