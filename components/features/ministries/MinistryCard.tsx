"use client"

import type { LucideIcon } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"

interface MinistryCardProps {
  name: string
  description: string
  icon: LucideIcon
  image: string
  additionalImage?: string
  color: string
  index: number
}

export default function MinistryCard({
  name,
  description,
  icon: Icon,
  image,
  additionalImage,
  color,
  index,
}: MinistryCardProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30`} />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold">{name}</h3>
        </div>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <div className="mt-4 overflow-hidden rounded-lg">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={600}
            height={500}
            className="h-68 w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {additionalImage && (
          <div className="mt-4 overflow-hidden rounded-lg">
            <Image
              src={additionalImage || "/placeholder.svg"}
              alt={`${name} additional`}
              width={600}
              height={400}
              className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

