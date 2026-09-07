"use client"

import { Heart, Music, BookOpen, Users } from "lucide-react"
import { motion } from "framer-motion"

const ministries = [
  {
    name: "Worship Ministry",
    description: "Experience the presence of God through anointed praise and worship led by our dedicated team.",
    icon: Music,
  },
  {
    name: "Bible Study",
    description: "Deepen your understanding of God's word through our engaging and transformative Bible studies.",
    icon: BookOpen,
  },
  {
    name: "Outreach & Missions",
    description: "Join us as we share God's love with our community and beyond through various outreach programs.",
    icon: Heart,
  },
  {
    name: "Youth Fellowship",
    description: "A vibrant community where young people grow in faith and build lasting relationships.",
    icon: Users,
  },
]

export default function Ministries() {
  return (
    <div className="py-12 md:py-24 bg-background relative overflow-hidden" id="ministries">
      {/* Add background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/4 w-1/2 h-1/2 bg-primary-light rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/4 w-1/2 h-1/2 bg-secondary-light rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:text-center">
          <motion.h2
            className="text-base text-primary font-semibold tracking-wide uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Our Ministries
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Growing Together in Faith
          </motion.p>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            At RCCG Halleluyah House, we offer various ministries designed to help you grow spiritually and connect
            with others in meaningful ways.
          </motion.p>
        </div>

        <div className="mt-20">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {ministries.map((ministry, index) => (
              <motion.div
                key={ministry.name}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <dt>
                  <motion.div
                    className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ministry.icon className="h-6 w-6" aria-hidden="true" />
                  </motion.div>
                  <p className="ml-16 text-lg leading-6 font-medium text-foreground">{ministry.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-muted-foreground">{ministry.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

