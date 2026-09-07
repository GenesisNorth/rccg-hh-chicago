"use client"

import { Heart, Music, BookOpen, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useId, useState, useRef, useCallback } from "react"

const ministries = [
  {
    name: "Worship",
    description:
      "Experience the presence of God through anointed praise and worship led by our dedicated team.",
    Icon: Music,
    image: "/images/keyboard-worship.jpeg",
    gradientFrom: "#7c3aed",
    gradientTo: "#4f46e5",
  },
  {
    name: "Bible Study",
    description:
      "Deepen your understanding of God's word through our engaging and transformative Bible studies.",
    Icon: BookOpen,
    image: "/images/preacher-podium.jpeg",
    gradientFrom: "#f59e0b",
    gradientTo: "#d97706",
  },
  {
    name: "Outreach & Missions",
    description:
      "Join us as we share God's love with our community and beyond through various outreach programs.",
    Icon: Heart,
    image: "/images/community-service.jpeg",
    gradientFrom: "#06b6d4",
    gradientTo: "#0891b2",
  },
  {
    name: "Youth Fellowship",
    description:
      "A vibrant community where young people grow in faith and build lasting relationships.",
    Icon: Users,
    image: "/images/purple-preacher.jpeg",
    gradientFrom: "#10b981",
    gradientTo: "#059669",
  },
]

const PEEK_X = 28
const PEEK_Y = -24
const PEEK_SCALE = 0.035
const SWIPE_THRESHOLD = 50

export default function EnhancedMinistries() {
  const headingId = useId()
  const descriptionId = useId()
  const [active, setActive] = useState(0)
  const total = ministries.length

  // Pointer tracking — no Framer drag needed
  const pointerStartX = useRef<number | null>(null)
  const pointerStartY = useRef<number | null>(null)
  const didMove = useRef(false)

  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total])
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total])

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX
    pointerStartY.current = e.clientY
    didMove.current = false
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return
    const dx = e.clientX - pointerStartX.current
    const dy = e.clientY - (pointerStartY.current ?? e.clientY)

    // Only treat as horizontal swipe if x movement dominates
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      didMove.current = true
      if (dx < 0) next()
      else prev()
    }

    pointerStartX.current = null
    pointerStartY.current = null
  }

  const handlePointerCancel = () => {
    pointerStartX.current = null
    pointerStartY.current = null
  }

  const handleClick = () => {
    // Only advance on tap (not after a swipe)
    if (!didMove.current) next()
    didMove.current = false
  }

  // Render deepest first, front last (highest z-index)
  const renderOrder = Array.from({ length: total }, (_, i) =>
    (active + total - i) % total
  ).reverse()

  return (
    <section
      className="py-12 md:py-24 bg-background overflow-hidden"
      id="ministries"
      aria-labelledby={headingId}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Who We Are
          </p>
          <h2
            id={headingId}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground"
          >
            Growing Together in Faith
          </h2>
          <p id={descriptionId} className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            RCCG Halleluyah House is a vibrant family of believers under the Redeemed
            Christian Church of God Worldwide.
          </p>
        </motion.div>

        {/* Card stack + nav */}
        <div className="flex flex-col items-center gap-14">

          {/* Stack */}
          <div className="relative w-full max-w-4xl mx-auto" style={{ height: 600, paddingTop: 48 }}>
            {renderOrder.map((cardIndex, layerFromBack) => {
              const isFront = layerFromBack === total - 1
              const depth = total - 1 - layerFromBack
              const card = ministries[cardIndex]

              return (
                <motion.div
                  key={card.name}
                  animate={{
                    x: depth * PEEK_X,
                    y: depth * PEEK_Y,
                    scale: 1 - depth * PEEK_SCALE,
                    filter: isFront ? "none" : `brightness(${1 - depth * 0.15})`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 32 }}
                  className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                  style={{ zIndex: layerFromBack, cursor: isFront ? "pointer" : "default" }}
                  // Pointer handlers only on front card
                  onPointerDown={isFront ? handlePointerDown : undefined}
                  onPointerUp={isFront ? handlePointerUp : undefined}
                  onPointerCancel={isFront ? handlePointerCancel : undefined}
                  onClick={isFront ? handleClick : undefined}
                  aria-label={isFront ? `${card.name} — tap or swipe to continue` : card.name}
                  role={isFront ? "button" : undefined}
                >
                  {/* Image */}
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* Gradient scrim */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${card.gradientFrom}f0 0%, ${card.gradientTo}99 38%, transparent 72%)`,
                    }}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                    {/* Icon chip */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                      <card.Icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>

                    <h3 className="text-white text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
                      {card.name}
                    </h3>
                    <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-md">
                      {card.description}
                    </p>

                    {/* Dot indicators — front only */}
                    {isFront && (
                      <div className="flex gap-2 mt-6">
                        {ministries.map((_, i) => (
                          <button
                            key={i}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); setActive(i) }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              i === active ? "bg-card w-6" : "bg-white/40 w-1.5"
                            }`}
                            aria-label={`Go to ${ministries[i].name}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hint text */}
                  {isFront && (
                    <p className="absolute top-5 right-5 text-xs text-white/55 font-medium tracking-wide select-none pointer-events-none">
                      Tap or swipe →
                    </p>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-5">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border bg-card shadow-sm flex items-center justify-center text-foreground hover:bg-accent transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm text-muted-foreground tabular-nums font-medium">
              {active + 1} / {total}
            </span>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-border bg-card shadow-sm flex items-center justify-center text-foreground hover:bg-accent transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
