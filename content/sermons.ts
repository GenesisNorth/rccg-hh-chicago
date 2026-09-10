/**
 * Sermon archive — edit this file to update the /sermons page.
 *
 * `videoUrl` accepts any link (YouTube, Facebook, Vimeo); it opens in a new tab.
 * `series` groups sermons in the filter dropdown; leave it out for standalone messages.
 */

export interface Sermon {
  id: string;
  title: string;
  preacher?: string;
  /** ISO date, e.g. "2026-08-24" */
  date: string;
  description: string;
  scripture?: string;
  series?: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnail?: string;
  featured?: boolean;
}

export const sermons: Sermon[] = [
  {
    id: "walking-in-the-spirit",
    title: "Walking In The Spirit",
    date: "2026-08-30",
    description:
      "What it means to live day by day in step with the Holy Spirit, and how that changes the ordinary parts of our week.",
    scripture: "Galatians 5:16–26",
    series: "Life In The Spirit",
    thumbnail: "/images/preaching.jpeg",
    featured: true,
  },
  {
    id: "the-power-of-a-praying-family",
    title: "The Power Of A Praying Family",
    date: "2026-08-23",
    description:
      "Prayer is the backbone of the home. A look at how families are rebuilt when they pray together.",
    scripture: "Acts 12:5–17",
    series: "Foundations",
    thumbnail: "/images/mother-child.jpeg",
  },
  {
    id: "you-are-welcome-as-you-are",
    title: "You Are Welcome Exactly As You Are",
    date: "2026-08-16",
    description:
      "The invitation of the Gospel has no entry requirements. A message on grace for the person who feels far off.",
    scripture: "John 3:16",
    series: "Foundations",
    thumbnail: "/images/worship.jpeg",
  },
  {
    id: "a-heart-of-worship",
    title: "A Heart Of Worship",
    date: "2026-08-09",
    description:
      "Worship is more than the songs we sing on Sunday. Discovering the life that God actually calls worship.",
    scripture: "Romans 12:1–2",
    thumbnail: "/images/keyboard-worship.jpeg",
  },
];

/** Distinct series names, for the filter dropdown. */
export const sermonSeries = Array.from(
  new Set(sermons.map((s) => s.series).filter((s): s is string => Boolean(s)))
).sort();
