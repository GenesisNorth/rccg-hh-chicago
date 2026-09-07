"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"

interface CarouselItem {
  id: number
  content: string
  bgColor: string
}

interface StepCarouselProps {
  items: CarouselItem[]
  animationDuration?: number
  width?: number
  direction?: "up" | "down"
  horizontalMovement?: boolean
}

export default function StepCarousel({
  items,
  animationDuration = 20,
  width = 200,
  direction = "up",
  horizontalMovement = true,
}: StepCarouselProps) {
  // Duplicate items for seamless looping
  const duplicatedItems = [...items, ...items]
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [horizontalOffset, setHorizontalOffset] = useState(0)

  // Horizontal movement effect
  useEffect(() => {
    if (prefersReducedMotion || !horizontalMovement) return

    let animationId: number
    let startTime: number
    const maxOffset = 20 // Maximum pixels to move horizontally

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      // Create a gentle swaying motion using sine wave
      const newOffset = Math.sin(elapsed / 2000) * maxOffset
      setHorizontalOffset(newOffset)

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [prefersReducedMotion, horizontalMovement])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        height: "580px",
        width: `${width}px`,
        transform: `translateX(${horizontalOffset}px)`,
        transition: "transform 0.5s ease-out",
      }}
    >
      <motion.div
        initial={{ y: direction === "up" ? 0 : -580 }}
        animate={{ y: direction === "up" ? -580 : 0 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          duration: prefersReducedMotion ? 0 : animationDuration,
          ease: "linear",
        }}
        className="flex flex-col gap-4"
      >
        {duplicatedItems.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            whileHover={
              prefersReducedMotion
                ? {}
                : {
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }
            }
            className={`relative w-full h-[250px] shadow-md overflow-hidden ${item.bgColor}`}
          >
            <Image
              src={item.content || "/placeholder.svg"}
              alt=""
              fill
              sizes="(max-width: 768px) 45vw, 240px"
              className="object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

