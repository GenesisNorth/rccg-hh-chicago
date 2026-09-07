"use client"

import { motion } from "framer-motion"

const testimonies = [
  {
    name: "Sister Grace Okonkwo",
    role: "Church Member since 2018",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "RCCG Halleluyah House has been a spiritual home for me. The teachings have transformed my life and deepened my relationship with God.",
  },
  {
    name: "Brother Emmanuel Adeyemi",
    role: "Youth Ministry Leader",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "The community here is truly special. I've found purpose and direction through the mentorship and fellowship at The Emerging Generation.",
  },
  {
    name: "Sister Blessing Nnamdi",
    role: "Worship Team Member",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "Serving in the worship ministry has been a blessing. I've grown not just spiritually but also in my musical gifts and leadership abilities.",
  },
]

export default function Testimonies() {
  return (
    <div className="bg-secondary py-16 sm:py-24 relative overflow-hidden" id="testimonies">
      {/* Add background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-16 w-32 h-32 bg-primary-light rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-16 w-24 h-24 bg-secondary-light rounded-full"
          animate={{
            y: [0, 30, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Testimonies of Faith</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Hear how God is working in the lives of our church members
          </p>
        </motion.div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonies.map((testimony, index) => (
            <motion.div
              key={testimony.name}
              className="bg-background border border-border shadow-lg rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="px-6 py-8">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={testimony.image || "/placeholder.svg"}
                    alt={testimony.name}
                  />
                  <div className="ml-4">
                    <div className="text-lg font-medium text-foreground">{testimony.name}</div>
                    <div className="text-sm text-muted-foreground">{testimony.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground italic">"{testimony.quote}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

