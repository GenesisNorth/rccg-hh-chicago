"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function VideoWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Only show on home page
  const isHomePage = pathname === "/"

  // Show modal after a short delay when the site loads, but only on home page
  useEffect(() => {
    // Only proceed if we're on the home page
    if (!isHomePage) return

    // Check if the user has already seen the welcome video in this session
    const hasSeenVideo = localStorage.getItem("welcomeVideoSeen") === "true"

    // If they haven't seen it, show the modal after a delay
    if (!hasSeenVideo) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isHomePage])

  // Store in localStorage that the user has seen the welcome video
  const closeModal = () => {
    setIsOpen(false)
    localStorage.setItem("welcomeVideoSeen", "true")
  }

  // Don't render anything if not on home page
  if (!isHomePage) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-4xl mx-4 bg-background rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="relative aspect-video">
              {/* Welcome image */}
              <img
                className="h-full w-full object-cover"
                src="/images/praise.jpeg"
                alt="Worship at RCCG Halleluyah House"
              />

              {/* Overlay with church name and welcome message */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center text-white p-6">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-5xl font-bold text-center mb-4"
                >
                  Welcome to RCCG Halleluyah House
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl text-center max-w-2xl mb-8"
                >
                  Join us as we worship, grow, and serve together in the heart of Grayslake, IL
                </motion.p>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                  <Button size="lg" onClick={closeModal} className="bg-primary hover:bg-primary/90 text-white">
                    Explore Our Church
                  </Button>
                </motion.div>
              </div>

              {/* Close control */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Close welcome"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

