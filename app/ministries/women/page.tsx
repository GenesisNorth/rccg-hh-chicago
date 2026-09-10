"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Calendar, MapPin, Heart, BookOpen, Users, Star } from "lucide-react"
import { motion } from "framer-motion"

export default function WomenMinistryPage() {
  const activities = [
    {
      title: "Bible Study & Prayer",
      description: "Deepen your understanding of Scripture and grow in your prayer life through our weekly studies.",
      icon: BookOpen,
      color: "bg-pink-500/10 text-pink-600",
    },
    {
      title: "Mentorship Program",
      description: "Connect with experienced women of faith for guidance, encouragement, and spiritual growth.",
      icon: Star,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Community Outreach",
      description: "Share God's love through various service projects focused on women and children in need.",
      icon: Heart,
      color: "bg-rose-500/10 text-rose-600",
    },
    {
      title: "Fellowship Events",
      description: "Build meaningful friendships through retreats, conferences, and social gatherings.",
      icon: Users,
      color: "bg-teal-500/10 text-teal-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background selection:bg-[#16A34A]/20">
      <main>
        {/* === HERO === */}
        <section className="relative overflow-hidden px-4 pb-12 pt-8 text-center sm:px-6 md:pb-16 lg:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[#16A34A]/8 blur-[100px] sm:h-[400px] sm:w-[700px]" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <span className="mb-5 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#16A34A]">
              Women's Ministry
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-7xl">
              Rooted in Grace,
              <br />
              <span className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] bg-clip-text text-transparent">
                Growing in Purpose
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Empowering women to discover their God-given purpose, grow in faith, and build meaningful
              relationships.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full rounded-full bg-[#16A34A] px-8 py-6 text-base font-semibold text-white shadow-lg shadow-[#16A34A]/25 transition-all hover:scale-105 hover:bg-[#15803D] sm:w-auto">
                  Join Our Community
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="mx-auto mt-12 h-px max-w-5xl origin-center bg-gradient-to-r from-transparent via-[#16A34A]/40 to-transparent"
          />
        </section>

        {/* === IMMERSIVE HERO IMAGE === */}
        <section className="px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto h-[420px] max-w-7xl overflow-hidden rounded-[3rem] shadow-2xl md:h-[560px]"
          >
            <img
              src="/images/mother-child.jpeg"
              alt="Women's Ministry at RCCG Halleluyah House"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute bottom-7 left-6 right-6 sm:max-w-sm"
            >
              <div className="rounded-2xl border border-white/15 bg-black/40 p-5 shadow-xl backdrop-blur-xl">
                <p className="text-sm italic leading-relaxed text-white/90">
                  &ldquo;She is clothed with strength and dignity; she can laugh at the days to come.&rdquo;
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-green-300">Proverbs 31:25</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* === ABOUT + AT A GLANCE === */}
        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8 md:mt-32">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-6 text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                A Community of
                <br />
                Faith &amp; Sisterhood
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                The Women's Ministry at RCCG Halleluyah House is a vibrant community of women from all
                walks of life who gather to support, encourage, and inspire one another in their faith
                journey.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Through Bible studies, prayer groups, mentorship, and fellowship events, we aim to equip
                women to grow in their relationship with God, strengthen their families, and make a
                positive impact in their communities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-[3rem] border border-border bg-muted p-10 shadow-xl md:p-14"
            >
              <h3 className="mb-8 text-2xl font-bold text-foreground">At a Glance</h3>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="mr-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm">
                    <Calendar className="h-6 w-6 text-[#16A34A]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">Monthly Women's Fellowship</h4>
                    <p className="mt-1 text-muted-foreground">Third Saturday of each month, 10:00 AM – 12:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm">
                    <Clock className="h-6 w-6 text-[#16A34A]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">Women's Bible Study</h4>
                    <p className="mt-1 text-muted-foreground">Tuesday mornings, 10:00 AM – 11:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm">
                    <MapPin className="h-6 w-6 text-[#16A34A]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">Location</h4>
                    <p className="mt-1 text-muted-foreground">888 E. Belvidere Rd, Suite 403, Grayslake, IL</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* === WHAT WE OFFER === */}
        <section className="mt-32 border-y border-border bg-muted py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-extrabold text-foreground">What We Offer</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Spaces to grow in faith, purpose, and lasting friendship.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-[2rem] border border-border bg-card p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${activity.color}`}>
                    <activity.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{activity.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{activity.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* === FEATURE MASONRY === */}
        <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="group h-[320px] overflow-hidden rounded-[2rem] shadow-xl md:h-[420px]"
            >
              <img
                src="/images/celebration.jpeg"
                alt="Women in fellowship and celebration"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="group h-[320px] overflow-hidden rounded-[2rem] shadow-xl md:h-[420px]"
            >
              <img
                src="/images/praise.jpeg"
                alt="Women of RCCG Halleluyah House in worship"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </div>
        </section>

        {/* === FINAL CTA === */}
        <section className="mx-auto mt-32 max-w-5xl px-4 pb-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[3rem] bg-[#111827] p-12 text-center md:p-20"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#16A34A]/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#15803D]/20 blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="mb-6 text-3xl font-extrabold text-white md:text-5xl">Join Our Women's Ministry</h2>
              <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-300">
                We invite all women to grow together in faith, build meaningful relationships, and
                support one another on the journey.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button className="w-full rounded-full bg-[#16A34A] px-8 py-6 text-base font-semibold text-white transition-colors hover:bg-card hover:text-foreground sm:w-auto">
                    Join Women's Fellowship
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
