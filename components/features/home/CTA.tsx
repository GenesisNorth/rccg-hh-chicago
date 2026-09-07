"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export default function CTA() {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-xl">
      {/* Background Image */}
      <img
        src="/images/cta-worship.png"
        alt="Congregation worshipping together"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-extrabold text-white sm:text-4xl drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="block">Join Our Church Family</span>
          <span className="block mt-2">Experience God's Love</span>
        </motion.h2>
        <motion.p
          className="mt-4 text-lg leading-6 text-white/90 drop-shadow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          We invite you to be part of The Emerging Generation. Come worship with us this Sunday and experience the
          difference.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="mt-8 bg-card text-primary hover:bg-white/90">
              Plan Your Visit
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
