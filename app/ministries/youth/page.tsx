"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Calendar, MapPin, Music, Users, Heart, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

export default function YouthMinistryPage() {
  const activities = [
    {
      title: "Worship & Praise",
      description: "Experience vibrant, youth-led worship that connects hearts to God through contemporary music.",
      icon: Music,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Bible Study",
      description: "Engage with Scripture in relevant, discussion-based studies that apply to real-life situations.",
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Community Service",
      description: "Put faith into action through regular outreach and service projects in our local community.",
      icon: Heart,
      color: "bg-rose-500/10 text-rose-600",
    },
    {
      title: "Fellowship",
      description: "Build lasting friendships through social events, game nights, retreats, and shared meals.",
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
              Youth Ministry
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-7xl">
              Young, Bold,
              <br />
              <span className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] bg-clip-text text-transparent">
                Unstoppable in Faith
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Empowering the next generation to discover their purpose, develop their faith, and make a
              difference in their world.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full rounded-full bg-[#16A34A] px-8 py-6 text-base font-semibold text-white shadow-lg shadow-[#16A34A]/25 transition-all hover:scale-105 hover:bg-[#15803D] sm:w-auto">
                  Join Our Youth Group
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
              src="/images/keyboard-worship.jpeg"
              alt="Youth Ministry at RCCG Halleluyah House"
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
                  &ldquo;Don't let anyone look down on you because you are young.&rdquo;
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-green-300">1 Timothy 4:12</p>
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
                A Place to Belong,
                <br />
                A Faith to Own
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                The Youth Ministry at RCCG Halleluyah House is a vibrant community of young people aged
                13–25 who are passionate about growing in their faith and making a positive impact in
                the world.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Through dynamic worship, relevant teaching, small groups, and service opportunities, we
                equip young people to live out their faith in every area of life.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-[3rem] border border-border bg-muted p-10 shadow-xl md:p-14"
            >
              <h3 className="mb-8 text-2xl font-bold text-foreground">Youth Service Times</h3>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="mr-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm">
                    <Calendar className="h-6 w-6 text-[#16A34A]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">Sunday Youth Service</h4>
                    <p className="mt-1 text-muted-foreground">4:00 PM – 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm">
                    <Clock className="h-6 w-6 text-[#16A34A]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">Friday Youth Night</h4>
                    <p className="mt-1 text-muted-foreground">6:30 PM – 8:30 PM</p>
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

        {/* === WHAT WE DO === */}
        <section className="mt-32 border-y border-border bg-muted py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-extrabold text-foreground">What We Do</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Real faith, real friendships, real impact — built for where you are right now.
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
                src="/images/praise.jpeg"
                alt="Praise and worship at RCCG Halleluyah House"
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
                src="/images/worship.jpeg"
                alt="Fellowship at RCCG Halleluyah House"
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
              <h2 className="mb-6 text-3xl font-extrabold text-white md:text-5xl">Join Our Youth Ministry</h2>
              <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-300">
                Whether you're a teenager looking for a place to belong or a parent interested in our
                youth programs, we'd love to connect with you!
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button className="w-full rounded-full bg-[#16A34A] px-8 py-6 text-base font-semibold text-white transition-colors hover:bg-card hover:text-foreground sm:w-auto">
                    Register for Youth Group
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
