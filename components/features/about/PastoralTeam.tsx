"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const pastors = [
  {
    name: "Pastor Oluwaseun Adebola Aminu",
    role: "Lead Pastor",
    image: "/images/preaching.jpeg",
    bio: "Pastor Oluwaseun has been leading our congregation for over 15 years with wisdom and compassion. His vision for The Emerging Generation is to raise disciples who will impact their generation for Christ.",
  },
  {
    name: "Pastor Toluwani Aminu",
    role: "Associate Pastor",
    image: "/images/preacher-podium.jpeg",
    bio: "Pastor Toluwani Aminu oversees our women's ministry and children's church. Her passion is to see families grow together in faith and love.",
  },
  {
    name: "Pastor Taiwo Ibidapo",
    role: "Associate Pastor",
    image: "/images/keyboard-worship.jpeg",
    bio: "Pastor Taiwo Ibidapo leads our vibrant youth ministry. He is dedicated to mentoring young people and helping them discover their purpose in Christ.",
  },
]

export default function PastoralTeam() {
  return (
    <div className="py-12 md:py-24 bg-secondary relative overflow-hidden" id="about">
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
            Our Leadership
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Meet Our Pastoral Team
          </motion.p>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Our dedicated pastors are committed to serving God and guiding our congregation in spiritual growth at RCCG
            RCCG Halleluyah House.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {pastors.map((pastor, index) => (
            <motion.div
              key={pastor.name}
              className="bg-background border border-border shadow-lg rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="aspect-w-3 aspect-h-2">
                <img className="w-full h-64 object-cover" src={pastor.image || "/placeholder.svg"} alt={pastor.name} />
              </div>
              <div className="px-6 py-8">
                <h3 className="text-xl font-bold text-foreground">{pastor.name}</h3>
                <p className="text-primary font-medium">{pastor.role}</p>
                <p className="mt-4 text-muted-foreground">{pastor.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/about/leadership-team">
            <Button size="lg" className="group">
              View All Leadership Team
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

