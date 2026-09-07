"use client"

import { motion } from "framer-motion"
import { ImageIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CollageGallery from "@/components/features/media/CollageGallery"

// All available church images
const ALL_IMAGES = [
  "/images/celebration.jpeg",
  "/images/preaching.jpeg",
  "/images/keyboard-worship.jpeg",
  "/images/community-service.jpeg",
  "/images/praise.jpeg",
  "/images/preacher-podium.jpeg",
  "/images/worship.jpeg",
  "/images/mother-child.jpeg",
  "/images/purple-preacher.jpeg",
]

// Gallery data — each category has 7+ entries so the CollageGallery grid is always full
const galleryItems = [
  // Worship (7)
  { id: 1,  image: ALL_IMAGES[2], date: "2023-12-10", category: "worship" },
  { id: 2,  image: ALL_IMAGES[1], date: "2023-11-15", category: "worship" },
  { id: 3,  image: ALL_IMAGES[4], date: "2023-10-22", category: "worship" },
  { id: 4,  image: ALL_IMAGES[6], date: "2023-12-18", category: "worship" },
  { id: 5,  image: ALL_IMAGES[8], date: "2023-09-05", category: "worship" },
  { id: 6,  image: ALL_IMAGES[0], date: "2023-11-08", category: "worship" },
  { id: 7,  image: ALL_IMAGES[5], date: "2023-12-05", category: "worship" },
  // Events (7)
  { id: 8,  image: ALL_IMAGES[0], date: "2023-12-10", category: "events" },
  { id: 9,  image: ALL_IMAGES[5], date: "2023-11-15", category: "events" },
  { id: 10, image: ALL_IMAGES[8], date: "2023-10-22", category: "events" },
  { id: 11, image: ALL_IMAGES[1], date: "2023-12-18", category: "events" },
  { id: 12, image: ALL_IMAGES[4], date: "2023-09-05", category: "events" },
  { id: 13, image: ALL_IMAGES[2], date: "2023-11-08", category: "events" },
  { id: 14, image: ALL_IMAGES[6], date: "2023-12-05", category: "events" },
  // Outreach (7)
  { id: 15, image: ALL_IMAGES[3], date: "2023-12-10", category: "outreach" },
  { id: 16, image: ALL_IMAGES[7], date: "2023-11-15", category: "outreach" },
  { id: 17, image: ALL_IMAGES[0], date: "2023-10-22", category: "outreach" },
  { id: 18, image: ALL_IMAGES[4], date: "2023-12-18", category: "outreach" },
  { id: 19, image: ALL_IMAGES[1], date: "2023-09-05", category: "outreach" },
  { id: 20, image: ALL_IMAGES[5], date: "2023-11-08", category: "outreach" },
  { id: 21, image: ALL_IMAGES[8], date: "2023-12-05", category: "outreach" },
  // Fellowship (7)
  { id: 22, image: ALL_IMAGES[7], date: "2023-12-10", category: "fellowship" },
  { id: 23, image: ALL_IMAGES[6], date: "2023-11-15", category: "fellowship" },
  { id: 24, image: ALL_IMAGES[3], date: "2023-10-22", category: "fellowship" },
  { id: 25, image: ALL_IMAGES[2], date: "2023-12-18", category: "fellowship" },
  { id: 26, image: ALL_IMAGES[8], date: "2023-09-05", category: "fellowship" },
  { id: 27, image: ALL_IMAGES[0], date: "2023-11-08", category: "fellowship" },
  { id: 28, image: ALL_IMAGES[4], date: "2023-12-05", category: "fellowship" },
]

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Group images by category
const getImagesByCategory = () => {
  const categories: Record<string, typeof galleryItems> = {}

  galleryItems.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = []
    }
    categories[item.category].push(item)
  })

  return categories
}

export default function GalleryPage() {
  const categorizedImages = getImagesByCategory()
  const hasImages = Object.values(categorizedImages).some((items) => items.length > 0)

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow pt-12 md:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* === HERO SECTION === */}
          <div className="text-center max-w-4xl mx-auto mb-20 md:mb-32 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h4 className="text-[#16A34A] font-bold tracking-widest text-sm uppercase mb-4">
                Life & Moments
              </h4>
              <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
                Our Beautiful <br className="hidden md:block"/> Journey.
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Explore a visual diary of our worship, events, and community outreach. A true reflection of the vibrant life here at the Lighthouse.
              </p>
            </motion.div>
          </div>

          {/* Filters (Removed as requested) */}

          {/* Categorized Gallery */}
          {hasImages ? (
            <div className="space-y-16">
              {Object.entries(categorizedImages).map(
                ([category, images]) =>
                  images.length > 0 && (
                    <div key={category} className="mb-12">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8 flex items-center">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                        <span className="ml-4 h-[2px] w-12 bg-[#16A34A]/30 inline-block rounded-full"></span>
                      </h2>

                      {/* Photo Collage using the CollageGallery component */}
                      <CollageGallery items={images} category={category} />
                    </div>
                  ),
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No images match your current filter.</p>
            </div>
          )}
        </div>
      </main>

    </div>
  )
}

