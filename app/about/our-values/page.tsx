"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, ArrowRight, HandHeart, Sparkles, Users, BookOpen, Globe2, ShieldCheck } from "lucide-react"
import { motion, type Variants } from "framer-motion"

// Animation variants — matches /about/what-we-believe for a consistent feel.
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const values = [
  {
    title: "Prayer",
    description:
      "Prayer is the backbone of everything we do. Every service, decision, and breakthrough is bathed in prayer before it's anything else.",
    icon: HandHeart,
    color: "from-[#16A34A] to-[#15803D]",
  },
  {
    title: "Excellence",
    description:
      "We give God and one another our very best — in worship, in service, and in how we care for every person who walks through our doors.",
    icon: Sparkles,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Family",
    description:
      "No one grows alone here. We build real community — small groups, mentorship, and relationships that carry you through every season.",
    icon: Users,
    color: "from-rose-500 to-red-500",
  },
  {
    title: "The Word",
    description:
      "Scripture shapes how we live, not just what we believe. We are committed to teaching and applying God's Word with honesty and depth.",
    icon: BookOpen,
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Evangelism",
    description:
      "Making heaven and taking as many people with us as we can — sharing the Gospel boldly, in our neighborhood and beyond.",
    icon: Globe2,
    color: "from-cyan-500 to-teal-500",
  },
  {
    title: "Integrity",
    description:
      "We aim to live set-apart lives — honest, accountable, and consistent — so our witness matches what we preach.",
    icon: ShieldCheck,
    color: "from-violet-500 to-purple-500",
  },
]

export default function OurValuesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted overflow-hidden">
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative pt-32 pb-10 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-border bg-card">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-green-50 to-[#16A34A]/5 blur-3xl opacity-70" />
            <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-amber-50 to-orange-50/30 blur-3xl opacity-50" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-sm font-medium text-muted-foreground mb-8 tracking-wide uppercase"
            >
              <Link href="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
              <span className="mx-3 text-muted-foreground">/</span>
              <span className="text-[#16A34A]">Our Values</span>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
                <motion.h1
                  variants={fadeUpVariant}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight"
                >
                  What We Stand <br className="hidden md:block" /> For
                </motion.h1>
                <motion.div variants={fadeUpVariant}>
                  <Link href="/">
                    <Button variant="outline" className="rounded-full px-6 py-6 border-border text-foreground hover:bg-muted font-semibold shadow-sm transition-all hover:pr-4 group">
                      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      Back to Home
                    </Button>
                  </Link>
                </motion.div>
              </div>

              <motion.p
                variants={fadeUpVariant}
                className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl"
              >
                Our beliefs tell you what we hold to be true. Our values tell you how we actually live it
                out — in worship, in community, and in the way we treat every person who walks through
                our doors.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Core values grid */}
        <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h4 variants={fadeUpVariant} className="text-sm font-bold tracking-widest text-[#16A34A] uppercase mb-3">
              What Drives Us
            </motion.h4>
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-4xl font-extrabold text-foreground">
              Our Core Values
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeUpVariant}
                className="group relative bg-card rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${value.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} text-white shadow-md mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="bg-[#111827] rounded-[3rem] p-12 lg:p-20 overflow-hidden relative shadow-2xl"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#16A34A] rounded-full blur-[80px] opacity-40 mix-blend-screen" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500 rounded-full blur-[80px] opacity-20 mix-blend-screen" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-center lg:text-left">
                <motion.h4 variants={fadeUpVariant} className="text-[#16A34A] font-bold text-sm tracking-widest uppercase mb-4">
                  Come See for Yourself
                </motion.h4>
                <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                  Values are best experienced, not just read.
                </motion.h2>
                <motion.p variants={fadeUpVariant} className="text-xl text-muted-foreground leading-relaxed mb-0">
                  Join us this Sunday and see what these values look like in a room full of real people.
                </motion.p>
              </div>
              <motion.div variants={fadeUpVariant} className="flex-shrink-0">
                <Link href="/contact">
                  <Button className="bg-[#16A34A] hover:bg-card hover:text-foreground text-white rounded-full px-10 py-8 text-lg font-bold shadow-xl shadow-[#16A34A]/30 transition-all hover:-translate-y-1">
                    Plan a Visit
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
