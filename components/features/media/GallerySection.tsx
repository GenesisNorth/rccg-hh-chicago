"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const photos = [
  { src: "/images/celebration.jpeg",     alt: "Church Celebration"    },
  { src: "/images/preaching.jpeg",        alt: "Sunday Service"        },
  { src: "/images/keyboard-worship.jpeg", alt: "Worship Team"          },
  { src: "/images/community-service.jpeg",alt: "Community Service"     },
  { src: "/images/praise.jpeg",           alt: "Praise & Worship"      },
  { src: "/images/preacher-podium.jpeg",  alt: "Preacher at the Podium"},
  { src: "/images/worship.jpeg",          alt: "Worship Service"       },
]

/**
 * Returns the transform properties for each card in the fan.
 * index 0 = center, negative = left side, positive = right side.
 */
function getFanStyle(offset: number) {
  const abs = Math.abs(offset)
  // clamp visible range to ±3
  if (abs > 3) return null

  const rotate    = offset * 14          // degrees, e.g. ±14, ±28, ±42
  const translateX = offset * 155        // px spread
  const translateY = abs * abs * 10      // arc: 0, 10, 40, 90 px down
  const scale      = 1 - abs * 0.1      // shrink outward
  const zIndex     = 10 - abs           // center on top
  const opacity    = 1 - abs * 0.12

  return { rotate, translateX, translateY, scale, zIndex, opacity }
}

export default function GallerySection() {
  const [active, setActive] = useState(3) // start centred on index 3

  const prev = () => setActive(i => (i - 1 + photos.length) % photos.length)
  const next = () => setActive(i => (i + 1) % photos.length)

  return (
    <section
      className="py-32 bg-card relative overflow-hidden select-none"
      id="gallery"
    >
      {/* Soft ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-200/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-4">
          <motion.p
            className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Church Gallery
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            Highlights from RCCG Halleluyah House
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Beautiful memories from our church events, services and activities.
          </motion.p>
        </div>

        {/* Fan Carousel */}
        <div className="relative flex items-center justify-center h-[520px] sm:h-[580px] mt-4 mb-4">
          {photos.map((photo, i) => {
            const offset = i - active
            // wrap-around: keep offset in the range [-n/2, n/2]
            const len = photos.length
            const wrapped = ((offset + Math.floor(len / 2)) % len) - Math.floor(len / 2)
            const style = getFanStyle(wrapped)

            if (!style) return null

            const { rotate, translateX, translateY, scale, zIndex, opacity } = style
            const isCenter = wrapped === 0

            return (
              <motion.div
                key={photo.src}
                className="absolute bottom-0 cursor-pointer"
                style={{ zIndex }}
                animate={{
                  rotate,
                  x: translateX,
                  y: translateY,
                  scale,
                  opacity,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                onClick={() => !isCenter && setActive(i)}
                whileHover={!isCenter ? { scale: scale + 0.04 } : undefined}
              >
                <div
                  className={`
                    overflow-hidden rounded-3xl shadow-2xl
                    ${isCenter
                      ? "w-64 h-96 sm:w-80 sm:h-[480px] ring-4 ring-white"
                      : "w-48 h-72 sm:w-60 sm:h-[360px]"}
                  `}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {isCenter && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 rounded-b-3xl">
                      <span className="text-white text-sm font-medium">{photo.alt}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Prev / Next controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Previous"
            className="w-11 h-11 rounded-full border border-border bg-card shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-6 h-2.5 bg-foreground"
                    : "w-2.5 h-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next"
            className="w-11 h-11 rounded-full border border-border bg-card shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* View Full Gallery CTA */}
        <div className="mt-10 text-center">
          <Link href="/gallery">
            <Button variant="outline" size="lg" className="group rounded-full px-8 border-border font-semibold shadow-sm">
              View Full Gallery
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
