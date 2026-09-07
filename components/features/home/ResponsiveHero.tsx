"use client"

import { Button } from "@/components/ui/button"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import StepCarousel from "@/components/ui/StepCarousel"
import MobileStepCarousel from "@/components/ui/MobileStepCarousel"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useId } from "react"

// Define carousel items for each column
const carouselItems1 = [
  { id: 1, content: "/images/preaching.jpeg", bgColor: "rounded-[100px]" },
  { id: 2, content: "/images/community-service.jpeg", bgColor: "rounded-[50px]" },
  { id: 3, content: "/images/praise.jpeg", bgColor: "rounded-[100px]" },
  { id: 4, content: "/images/keyboard-worship.jpeg", bgColor: "rounded-[50px]" },
]

const carouselItems2 = [
  { id: 1, content: "/images/worship.jpeg", bgColor: "rounded-[50px]" },
  { id: 2, content: "/images/preacher-podium.jpeg", bgColor: "rounded-[100px]" },
  { id: 3, content: "/images/celebration.jpeg", bgColor: "rounded-[50px]" },
  { id: 4, content: "/images/purple-preacher.jpeg", bgColor: "rounded-[100px]" },
]

const carouselItems3 = [
  { id: 1, content: "/images/mother-child.jpeg", bgColor: "rounded-[100px]" },
  { id: 2, content: "/images/keyboard-worship.jpeg", bgColor: "rounded-[50px]" },
  { id: 3, content: "/images/community-service.jpeg", bgColor: "rounded-[100px]" },
  { id: 4, content: "/images/preacher-podium.jpeg", bgColor: "rounded-[50px]" },
]

// All carousel items grouped for mobile view
const allCarouselItems = [carouselItems1, carouselItems2, carouselItems3]

export default function ResponsiveHero() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const prefersReducedMotion = useReducedMotion()

  // Generate unique IDs for accessibility
  const headingId = useId()
  const descriptionId = useId()

  return (
    <section
      className="bg-background pt-12 pb-16 md:pt-28 md:pb-24 lg:py-24 overflow-hidden relative"
      aria-labelledby={headingId}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Text content - takes 5 columns on desktop */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 text-center lg:text-left"
          >
            <h1 id={headingId} className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight">
              <motion.span
                className="text-primary block mb-2"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Halleluyah House
              </motion.span>
              <motion.span
                className="text-foreground"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                The Redeemed Christian Church of God
              </motion.span>
            </h1>
            <motion.p
              id={descriptionId}
              className="mt-6 text-lg md:text-xl text-muted-foreground mx-auto lg:mx-0 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              You are welcome exactly as you are. A Spirit-filled Pentecostal church in Grayslake, Illinois — making heaven and taking as many people as possible with us.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Join Us 
                <ArrowRight
                  className={`ml-2 h-4 w-4 ${prefersReducedMotion ? "" : "transition-transform group-hover:translate-x-1"}`}
                  aria-hidden="true"
                />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Watch Sermons
              </Button>
            </motion.div>
          </motion.div>

          {/* Carousel Section - takes 7 columns on desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="lg:col-span-7 mt-8 lg:mt-0"
            aria-hidden="true" // Decorative content
          >
            {isDesktop ? (
              <div className="flex justify-center items-start gap-3 h-[580px] overflow-visible">
                {/* First Carousel - Moving Upwards */}
                <motion.div
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="w-1/3"
                >
                  <StepCarousel
                    items={carouselItems1}
                    animationDuration={prefersReducedMotion ? 0 : 25}
                    width={240}
                    direction="up"
                  />
                </motion.div>

                {/* Second Carousel - Moving Downwards */}
                <motion.div
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="w-1/3 mt-16"
                >
                  <StepCarousel
                    items={carouselItems2}
                    animationDuration={prefersReducedMotion ? 0 : 30}
                    width={240}
                    direction="down"
                  />
                </motion.div>

                {/* Third Carousel - Moving Upwards */}
                <motion.div
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="w-1/3"
                >
                  <StepCarousel
                    items={carouselItems3}
                    animationDuration={prefersReducedMotion ? 0 : 35}
                    width={240}
                    direction="up"
                  />
                </motion.div>
              </div>
            ) : (
              // Mobile Carousel Section
              <MobileStepCarousel items={allCarouselItems} scrollSpeed={25} />
            )}
          </motion.div>
        </div>
      </div>

      {/* Animated background elements - softer and more subtle */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 dark:bg-primary/15 rounded-full"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-secondary/10 dark:bg-secondary/15 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -45, 0],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            aria-hidden="true"
          />
        </div>
      )}
    </section>
  )
}

