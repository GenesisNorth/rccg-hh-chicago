"use client"

import { motion } from "framer-motion"

interface GalleryItem {
  id: number
  image: string
  category: string
  date: string
}

interface CollageGalleryProps {
  items: GalleryItem[]
  category: string
}

export default function CollageGallery({ items, category }: CollageGalleryProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-6 gap-1 sm:gap-1.5 bg-transparent p-0.5">
        {/* Row 1 */}
        <div className="col-span-2 relative group" style={{ aspectRatio: "1/1" }}>
          <div className="block w-full h-full rounded-lg md:rounded-xl overflow-hidden border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 z-10 hover:z-20 relative">
            <img
              src={items[0]?.image || "/placeholder.svg?height=300&width=300"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none transition-colors duration-300" />
          </div>
        </div>
        <div className="col-span-4 relative group" style={{ aspectRatio: "2/1" }}>
          <div className="block w-full h-full rounded-lg md:rounded-xl overflow-hidden border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 z-10 hover:z-20 relative">
            <img
              src={items[1]?.image || "/placeholder.svg?height=300&width=600"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none transition-colors duration-300" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="col-span-4 relative group" style={{ aspectRatio: "2/1" }}>
          <div className="block w-full h-full rounded-lg md:rounded-xl overflow-hidden border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 z-10 hover:z-20 relative">
            <img
              src={items[2]?.image || "/placeholder.svg?height=300&width=600"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none transition-colors duration-300" />
          </div>
        </div>
        <div className="col-span-2 relative group" style={{ aspectRatio: "1/1" }}>
          <div className="block w-full h-full rounded-lg md:rounded-xl overflow-hidden border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 z-10 hover:z-20 relative">
            <img
              src={items[3]?.image || "/placeholder.svg?height=300&width=300"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none transition-colors duration-300" />
          </div>
        </div>

        {/* Row 3 */}
        <div className="col-span-2 relative group" style={{ aspectRatio: "1/1" }}>
          <div className="block w-full h-full rounded-lg md:rounded-xl overflow-hidden border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 z-10 hover:z-20 relative">
            <img
              src={items[4]?.image || "/placeholder.svg?height=200&width=300"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none transition-colors duration-300" />
          </div>
        </div>
        <div className="col-span-2 relative group" style={{ aspectRatio: "1/1" }}>
          <div className="block w-full h-full rounded-lg md:rounded-xl overflow-hidden border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 z-10 hover:z-20 relative">
            <img
              src={items[5]?.image || "/placeholder.svg?height=200&width=300"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none transition-colors duration-300" />
          </div>
        </div>
        <div className="col-span-2 relative group" style={{ aspectRatio: "1/1" }}>
          <div className="block w-full h-full rounded-lg md:rounded-xl overflow-hidden border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 z-10 hover:z-20 relative">
            <img
              src={items[6]?.image || "/placeholder.svg?height=200&width=300"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none transition-colors duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

