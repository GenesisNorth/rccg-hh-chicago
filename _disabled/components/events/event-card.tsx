"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Clock, Users, Check, CalendarDays } from "lucide-react";
import { UIEvent, isUpcoming } from "@/lib/event-types";

export function EventCard({ event, index = 0 }: { event: UIEvent; index?: number }) {
  const start = new Date(event.startDate);
  const upcoming = isUpcoming(event);
  const isFree = !event.price || event.price <= 0;
  const isFull = event.spotsRemaining !== null && event.spotsRemaining <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/events/${event.id}`}
        className="group block overflow-hidden rounded-3xl border border-black/5 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900"
      >
        {/* Media */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
              <CalendarDays className="h-12 w-12 text-primary/40" />
            </div>
          )}

          {/* Date tile — frosted glass, iOS style */}
          <div className="absolute left-4 top-4 flex flex-col items-center rounded-2xl bg-white/80 px-3 py-1.5 text-center shadow-lg backdrop-blur-md dark:bg-black/60">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              {format(start, "MMM")}
            </span>
            <span className="-mt-0.5 text-xl font-bold leading-none text-neutral-900 dark:text-white">
              {format(start, "d")}
            </span>
          </div>

          {/* Status / price pill */}
          <div className="absolute right-4 top-4 flex gap-2">
            {!upcoming ? (
              <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                Past
              </span>
            ) : isFull ? (
              <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                Full
              </span>
            ) : (
              <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-neutral-900 backdrop-blur-md dark:bg-black/60 dark:text-white">
                {isFree ? "Free" : `₦${event.price!.toLocaleString()}`}
              </span>
            )}
          </div>

          {event.isRegistered && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              <Check className="h-3.5 w-3.5" /> Registered
            </div>
          )}
        </div>

        {/* Body */}
        <div className="space-y-3 p-5">
          <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
            {event.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>

          <div className="space-y-1.5 pt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-primary/70" />
              <span>{format(start, "EEE, MMM d · h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            {event.capacity != null && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0 text-primary/70" />
                <span>
                  {event.currentAttendees} going
                  {event.spotsRemaining !== null && upcoming && ` · ${event.spotsRemaining} spots left`}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
