"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Quote } from "lucide-react"

const stories = [
  {
    name: "Abidemi Sharon",
    role: "Chorister",
    image: "/images/praise.jpeg",
    quote:
      "As I reflect on my years in this church, I am filled with gratitude for the community and faith that have shaped my life. I came here as a young seeker, lost and searching for purpose, and through the warmth of this congregation, I found not only my faith but a family.",
  },
  {
    name: "Pastor Emmanuel",
    role: "Youth Leader",
    image: "/images/preaching.jpeg",
    quote:
      "RCCG Halleluyah House gave me a platform to serve and grow. Watching young people encounter God for the first time — there is no greater privilege. This church is not just a building; it is where miracles happen every single week.",
  },
  {
    name: "Sister Grace",
    role: "Women's Ministry",
    image: "/images/mother-child.jpeg",
    quote:
      "When I first walked through these doors I was broken. The love I received from this congregation put me back together. Today I lead the women's fellowship and I see God's hand in every life we touch.",
  },
  {
    name: "Bro. Chukwuemeka",
    role: "Prayer Team",
    image: "/images/purple-preacher.jpeg",
    quote:
      "Prayer is the backbone of everything we do at Halleluyah House. Every breakthrough I have witnessed — personal, family, career — came through the altar of this church. I am grateful beyond words.",
  },
  {
    name: "Deacon Michael",
    role: "Outreach Coordinator",
    image: "/images/community-service.jpeg",
    quote:
      "Our outreach programs changed my perspective on what church means. It is not just Sunday service — it is touching lives seven days a week. RCCG Halleluyah House lives that out every day.",
  },
]

export default function MyLSCStory() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-12 md:py-24 bg-background" id="lsc-story">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Testimonies
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            MY HH STORY
          </h2>
        </motion.div>

        {/* Accordion row */}
        <div className="flex gap-3 h-[420px] sm:h-[460px]">
          {stories.map((story, i) => {
            const isActive = i === active

            return (
              <motion.div
                key={story.name}
                layout
                onClick={() => setActive(i)}
                animate={{ flex: isActive ? 5 : 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="relative rounded-3xl overflow-hidden cursor-pointer shadow-xl flex-shrink-0 min-w-0"
                style={{ minWidth: isActive ? undefined : 60 }}
                role="button"
                aria-label={`Read ${story.name}'s story`}
                aria-expanded={isActive}
              >
                {/* Full-bleed image */}
                <img
                  src={story.image}
                  alt={story.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: isActive
                      ? "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 100%)",
                  }}
                />

                {/* Collapsed state: vertical name label */}
                <AnimatePresence>
                  {!isActive && (
                    <motion.div
                      key="collapsed-label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-end justify-center pb-5"
                    >
                      <p
                        className="text-white text-xs font-semibold tracking-wide whitespace-nowrap"
                        style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
                      >
                        {story.name}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded state: quote + name */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="expanded-content"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.35, delay: 0.15 }}
                      className="absolute inset-0 flex flex-col justify-center px-8 sm:px-10 max-w-lg"
                    >
                      {/* Quote icon */}
                      <div className="w-10 h-10 rounded-xl bg-primary/80 backdrop-blur flex items-center justify-center mb-5">
                        <Quote className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>

                      {/* Quote text */}
                      <blockquote className="text-white text-base sm:text-lg leading-relaxed mb-6 line-clamp-6">
                        "{story.quote}"
                      </blockquote>

                      {/* Name & role */}
                      <div>
                        <p className="text-white font-bold text-lg">{story.name}</p>
                        <p className="text-white/65 text-sm">{story.role}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {stories.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "bg-primary w-6" : "bg-border w-1.5"
              }`}
              aria-label={`Go to story ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
