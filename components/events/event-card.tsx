"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, CalendarDays } from "lucide-react";
import { ChurchEvent } from "@/content/events";
import { formatLongDate, formatTime, formatMonthAbbr, formatDayOfMonth } from "@/lib/dates";

export function EventCard({
  event,
  index = 0,
  // Time-dependent, so the parent computes it only after mount — passing it in
  // keeps this card's first render identical on the server and in the browser.
  isPast = false,
}: {
  event: ChurchEvent;
  index?: number;
  isPast?: boolean;
}) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-card shadow-sm transition-shadow hover:shadow-lg dark:border-white/10"
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-col items-center rounded-2xl bg-card/95 px-3 py-2 shadow-md backdrop-blur">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#16A34A]">
            {formatMonthAbbr(event.startDate)}
          </span>
          <span className="text-xl font-bold leading-none text-foreground">{formatDayOfMonth(event.startDate)}</span>
        </div>
        {isPast && (
          <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
            Past
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#16A34A]/10 px-2.5 py-0.5 text-xs font-medium text-[#16A34A]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mb-2 text-lg font-bold leading-snug text-foreground">{event.title}</h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">{event.description}</p>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-[#16A34A]" />
            <span>
              {formatLongDate(event.startDate)} · {formatTime(event.startDate)}
              {event.endDate ? ` – ${formatTime(event.endDate)}` : ""}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
            <span>{event.location}</span>
          </div>
        </div>

        {event.registrationUrl && !isPast && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#16A34A]"
          >
            Register
          </a>
        )}
      </div>
    </motion.div>
  );
}
