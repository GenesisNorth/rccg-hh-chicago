"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Calendar } from "lucide-react"
import StepCarousel from "@/components/ui/StepCarousel"

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

export default function EnhancedHero() {
  return (
    <div className="bg-background pt-28 pb-10 md:pt-32 md:pb-32 overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Sunday Service: 8:00 AM & 9:00 AM
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <motion.span
                className="text-primary block mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                The Emerging Generation
              </motion.span>
              <motion.span
                className="text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                RCCG Living Seed Church
              </motion.span>
            </h1>
            <motion.p
              className="mt-6 text-xl text-muted-foreground max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Join us as we worship, grow, and serve together. Experience the love of Christ in a welcoming church
              dedicated to spiritual growth and fellowship.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button size="lg" className="w-full sm:w-auto group">
                Join Us On Sunday
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Watch Sermons
              </Button>
            </motion.div>
          </motion.div>

          {/* Carousel Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative hidden lg:flex justify-center gap-4 overflow-visible"
          >
            {/* First Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <StepCarousel items={carouselItems1} animationDuration={25} />
            </motion.div>

            {/* Second Carousel - Starts a bit lower */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-16"
            >
              <StepCarousel items={carouselItems2} animationDuration={30} />
            </motion.div>

            {/* Third Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <StepCarousel items={carouselItems3} animationDuration={35} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated background elements - softer and more subtle */}
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
        />
      </div>
    </div>
  )
}

