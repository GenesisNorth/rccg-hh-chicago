"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"

interface CarouselItem {
  id: number
  content: string
  bgColor: string
}

interface MobileStepCarouselProps {
  items: CarouselItem[][]
  scrollSpeed?: number
}

const MobileStepCarousel: React.FC<MobileStepCarouselProps> = ({ items, scrollSpeed = 20 }) => {
  // Flatten all items from different columns into a single array
  const allItems = items.flat()

  // Create a duplicate set of items for infinite scrolling effect
  const duplicatedItems = [...allItems, ...allItems]

  // State for alternating directions
  const [directions, setDirections] = useState<("up" | "down")[]>([])

  // Ref for the scrolling container
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion()

  // Set up alternating directions for mobile items
  useEffect(() => {
    const newDirections = duplicatedItems.map((_, index) => (index % 2 === 0 ? "up" : "down"))
    setDirections(newDirections)
  }, [duplicatedItems.length])

  // Automatic scrolling effect
  useEffect(() => {
    if (prefersReducedMotion || !scrollContainerRef.current) return

    let animationId: number
    let startTime: number
    const totalWidth = scrollContainerRef.current.scrollWidth
    const containerWidth = scrollContainerRef.current.clientWidth
    const scrollDistance = totalWidth - containerWidth

    const scroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      // Calculate position based on time and speed
      // The scrollSpeed determines how many seconds it takes to scroll through the entire content
      const scrollPosition = ((elapsed % (scrollSpeed * 1000)) / (scrollSpeed * 1000)) * scrollDistance

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollPosition
      }

      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [prefersReducedMotion, scrollSpeed])

  return (
    <div className="w-full overflow-hidden py-4" aria-hidden="true">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
        role="region"
        aria-label="Image gallery"
        tabIndex={0}
        style={{ scrollBehavior: "smooth" }}
      >
        {duplicatedItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * Math.min(index % allItems.length, 5), duration: 0.5 }}
            className={`relative flex-shrink-0 w-[250px] h-[250px] shadow-md overflow-hidden ${item.bgColor}`}
            whileHover={
              prefersReducedMotion
                ? {}
                : {
                    y: directions[index] === "up" ? -10 : 10,
                    transition: { duration: 0.3 },
                  }
            }
          >
            <Image
              src={item.content || "/placeholder.svg"}
              alt=""
              fill
              sizes="250px"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default MobileStepCarousel

