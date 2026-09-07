/**
 * Church events — edit this file to update the /events page.
 *
 * Dates are ISO strings ("YYYY-MM-DDTHH:MM:SS"), local to the church.
 * Anything with a start date in the past automatically moves to the "Past" tab.
 * Images live in /public/images and are referenced as "/images/<file>".
 */

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  /** ISO date-time, e.g. "2026-04-05T10:00:00" */
  startDate: string;
  /** ISO date-time, or null for single-moment events. */
  endDate: string | null;
  location: string;
  image: string | null;
  tags: string[];
  /** Optional — shown as a "Register" button when set. */
  registrationUrl?: string;
}

export const events: ChurchEvent[] = [
  {
    id: "sunday-celebration",
    title: "Sunday Celebration Service",
    description:
      "Our weekly gathering for worship, the Word, and fellowship. Come as you are — there is a place for you and your family at the table.",
    startDate: "2026-09-06T10:00:00",
    endDate: "2026-09-06T12:00:00",
    location: "888 E. Belvidere Rd, Suite 403, Grayslake, IL 60030",
    image: "/images/celebration.jpeg",
    tags: ["Weekly", "Worship"],
  },
  {
    id: "search-the-scriptures",
    title: "Search The Scriptures",
    description:
      "Bible study before the celebration service on the 2nd, 3rd and 4th Sundays of the month. Bring your Bible and your questions.",
    startDate: "2026-09-13T09:00:00",
    endDate: "2026-09-13T10:00:00",
    location: "888 E. Belvidere Rd, Suite 403, Grayslake, IL 60030",
    image: "/images/preaching.jpeg",
    tags: ["Bible Study"],
  },
  {
    id: "prayer-holy-communion",
    title: "Prayer & Holy Communion",
    description:
      "An evening of corporate prayer and communion on the first Thursday of every month. Come expectant.",
    startDate: "2026-10-01T19:00:00",
    endDate: "2026-10-01T20:30:00",
    location: "888 E. Belvidere Rd, Suite 403, Grayslake, IL 60030",
    image: "/images/purple-preacher.jpeg",
    tags: ["Prayer", "Monthly"],
  },
  {
    id: "workers-ministers-meeting",
    title: "Workers & Ministers Meeting",
    description:
      "Training, planning, and prayer for everyone serving in a department. Held on the first Sunday of each month.",
    startDate: "2026-10-04T09:00:00",
    endDate: "2026-10-04T10:00:00",
    location: "888 E. Belvidere Rd, Suite 403, Grayslake, IL 60030",
    image: "/images/community-service.jpeg",
    tags: ["Workers", "Monthly"],
  },
];
