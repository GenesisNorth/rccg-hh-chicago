"use client"

import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { events as allEvents } from "@/content/events"
import { formatDate, formatTime, sortKey } from "@/lib/dates"

export default function UpcomingEvents() {
  // The next three events, straight from content/events.ts — no fetch.
  // Dates are formatted timezone-independently (see lib/dates.ts) so this renders
  // identically on the server and in the browser.
  const events = allEvents
    .slice()
    .sort((a, b) => sortKey(a.startDate) - sortKey(b.startDate))
    .slice(0, 3)
    .map((e) => ({
      id: e.id,
      title: e.title,
      date: formatDate(e.startDate),
      time: formatTime(e.startDate),
      location: e.location,
      description: e.description,
    }))

  if (events.length === 0) {
    return null // Hide section if no events
  }

  return (
    <div className="py-12 md:py-24 bg-background relative overflow-hidden" id="events">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:text-center">
          <motion.h2
            className="text-base text-primary font-semibold tracking-wide uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Calendar
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Upcoming Events
          </motion.p>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Mark your calendars for these special events at RCCG Halleluyah House
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className="bg-background border border-border shadow-lg rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground line-clamp-3">{event.description}</p>
                <Button className="mt-6 w-full" asChild>
                  <Link href={`/events/${event.id}`}>Learn More</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/events">View All Events</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

