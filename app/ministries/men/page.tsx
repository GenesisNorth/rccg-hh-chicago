"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Calendar, MapPin, Shield, Users, Briefcase, Award, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function MenMinistryPage() {
  const activities = [
    {
      title: "Bible Study & Discipleship",
      description: "Deepen your understanding of Scripture and grow in your faith through our weekly studies.",
      icon: Shield,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Leadership Development",
      description: "Equipping men to lead with integrity in their homes, workplaces, and communities.",
      icon: Award,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Professional Networking",
      description: "Connect with other Christian men for mentorship, career guidance, and business opportunities.",
      icon: Briefcase,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Fellowship & Recreation",
      description: "Build meaningful friendships through social events, sports activities, and retreats.",
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
              Men's Ministry
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-7xl">
              Men of Purpose,
              <br />
              <span className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] bg-clip-text text-transparent">
                Built for Impact
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Building men of character, integrity, and purpose who lead their families and communities
              with godly wisdom.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full rounded-full bg-[#16A34A] px-8 py-6 text-base font-semibold text-white shadow-lg shadow-[#16A34A]/25 transition-all hover:scale-105 hover:bg-[#15803D] sm:w-auto">
                  Join Men's Fellowship
                </Button>
              </Link>
              <Link href="/events" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-border bg-transparent px-8 py-6 text-base font-semibold sm:w-auto"
                >
                  View Events
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
              src="/images/worship.jpeg"
              alt="Men's Ministry at RCCG Halleluyah House"
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
                  &ldquo;As iron sharpens iron, so one man sharpens another.&rdquo;
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-green-300">Proverbs 27:17</p>
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
                Growing Together
                <br />
                as Men of Faith
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                The Men's Ministry at RCCG Halleluyah House is committed to helping men grow in their
                relationship with God and fulfill their God-given roles as leaders, husbands, fathers,
                and servants in the church and community.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Whether you're a seasoned believer or just beginning your faith journey, there's a place
                for you here — to study God's Word, develop leadership skills, and serve with courage
                and integrity.
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
                    <h4 className="text-xl font-bold text-foreground">Monthly Men's Breakfast</h4>
                    <p className="mt-1 text-muted-foreground">First Saturday of each month, 8:00 AM – 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm">
                    <Clock className="h-6 w-6 text-[#16A34A]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">Men's Bible Study</h4>
                    <p className="mt-1 text-muted-foreground">Wednesday evenings, 7:00 PM – 8:30 PM</p>
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
                Practical ways to grow in faith, character, and brotherhood.
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
                src="/images/community-service.jpeg"
                alt="Fellowship at RCCG Halleluyah House"
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
                src="/images/keyboard-worship.jpeg"
                alt="Worship at RCCG Halleluyah House"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </div>
        </section>

        {/* === EVENTS CTA === */}
        <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-border bg-muted p-8 md:p-10"
          >
            <div>
              <h3 className="mb-2 text-2xl font-bold text-foreground">Retreats, breakfasts, and more</h3>
              <p className="max-w-xl text-muted-foreground">
                From our monthly breakfast to occasional retreats and conferences, see what's coming up
                for the men of this church.
              </p>
            </div>
            <Link href="/events">
              <Button variant="outline" className="rounded-full">
                See Upcoming Events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
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
              <h2 className="mb-6 text-3xl font-extrabold text-white md:text-5xl">Join Our Men's Ministry</h2>
              <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-300">
                We invite all men to grow together in faith, character, and leadership. Take the next
                step in your spiritual journey today.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button className="w-full rounded-full bg-[#16A34A] px-8 py-6 text-base font-semibold text-white transition-colors hover:bg-card hover:text-foreground sm:w-auto">
                    Join Men's Fellowship
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-gray-600 bg-transparent px-8 py-6 text-base font-semibold text-white hover:bg-gray-800 sm:w-auto"
                  >
                    Contact Ministry Leader
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
