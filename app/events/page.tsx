"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { EventCard } from "@/components/events/event-card";
import { Search, CalendarDays } from "lucide-react";
import { events } from "@/content/events";
import { hasPassed, sortKey } from "@/lib/dates";

type Segment = "upcoming" | "past" | "all";

const SEGMENTS: { value: Segment; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "all", label: "All" },
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [segment, setSegment] = useState<Segment>("upcoming");

  // Whether an event is "past" depends on the current time, which differs between
  // the server render and the browser. Splitting the list only after mount keeps
  // the first client render identical to the server HTML (no hydration mismatch),
  // and still ships every event in the initial HTML for search engines.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    let list = [...events];

    if (mounted) {
      if (segment === "upcoming") list = list.filter((e) => !hasPassed(e.startDate));
      else if (segment === "past") list = list.filter((e) => hasPassed(e.startDate));
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }

    // Upcoming: soonest first. Past/all: most recent first.
    return list.sort((a, b) => {
      const da = sortKey(a.startDate);
      const db = sortKey(b.startDate);
      return segment === "upcoming" ? da - db : db - da;
    });
  }, [segment, searchTerm, mounted]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      {/* Hero header */}
      <div className="border-b border-black/5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <CalendarDays className="h-3.5 w-3.5" /> What&apos;s On
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Church Events</h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Gather, grow, and give. Discover what&apos;s happening in our church family — everyone is welcome.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Controls: segmented + search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-full bg-muted p-1">
            {SEGMENTS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSegment(s.value)}
                className={`relative rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                  segment === s.value
                    ? "text-neutral-900 dark:text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {segment === s.value && (
                  <motion.span
                    layoutId="segment-pill"
                    className="absolute inset-0 rounded-full bg-card shadow-sm dark:bg-neutral-700"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-full border-black/10 bg-card pl-10 shadow-sm dark:border-white/10 dark:bg-neutral-900"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-muted/30 py-16 text-center dark:border-white/10">
            <CalendarDays className="mb-4 h-14 w-14 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold">No events found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {searchTerm
                ? "Try a different search term."
                : segment === "upcoming"
                ? "There are no upcoming events right now. Check back soon."
                : "Nothing here yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                isPast={mounted && hasPassed(event.startDate)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
