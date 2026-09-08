"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen, Heart, Users, Star, ArrowRight } from "lucide-react"
import { motion, type Variants } from "framer-motion"

// Animation Variants
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

export default function WhatWeBelievePage() {
  // Core beliefs
  const coreBeliefs = [
    {
      title: "The Bible",
      description:
        "We believe the Bible is the inspired, infallible Word of God and our final authority for faith and practice.",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Salvation",
      description:
        "We believe salvation comes through faith in Jesus Christ alone, by grace through faith, not by works.",
      icon: Heart,
      color: "from-rose-500 to-red-500",
    },
    {
      title: "The Church",
      description:
        "We believe the church is the body of Christ, called to worship, fellowship, discipleship, ministry, and evangelism.",
      icon: Users,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "The Holy Spirit",
      description:
        "We believe in the present ministry of the Holy Spirit who empowers believers to live godly lives and serve effectively.",
      icon: Star,
      color: "from-[#16A34A] to-[#15803D]",
    },
  ]

  const statementOfFaith = [
    {
      id: "01",
      title: "The Trinity",
      content:
        "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit, equal in power and glory.",
    },
    {
      id: "02",
      title: "Jesus Christ",
      content:
        "We believe in the deity of Jesus Christ, His virgin birth, sinless life, miracles, atoning death, bodily resurrection, ascension to the right hand of the Father, and His personal return in power and glory.",
    },
    {
      id: "03",
      title: "The Holy Spirit",
      content:
        "We believe in the present ministry of the Holy Spirit, by whose indwelling the Christian is enabled to live a godly life. We believe in the baptism of the Holy Spirit as a distinct experience from salvation, empowering believers for ministry and godly living.",
    },
    {
      id: "04",
      title: "Humanity",
      content:
        "We believe that all people are created in the image of God but fell into sin and are therefore lost, and only through regeneration by the Holy Spirit can salvation and spiritual life be obtained.",
    },
    {
      id: "05",
      title: "Salvation",
      content:
        "We believe that the shed blood of Jesus Christ and His resurrection provide the only ground for justification and salvation for all who believe, and only such as receive Jesus Christ are born of the Holy Spirit and thus become children of God.",
    },
    {
      id: "06",
      title: "The Church",
      content:
        "We believe in the spiritual unity of believers in our Lord Jesus Christ and that all true believers are members of His body, the Church.",
    },
    {
      id: "07",
      title: "The Future",
      content:
        "We believe in the resurrection of both the saved and the lost; they that are saved unto the resurrection of life, and they that are lost unto the resurrection of damnation.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-muted overflow-hidden">
      
      <main className="flex-grow">
        
        {/* =========================================
            HEADER & HERO SECTION 
        =========================================== */}
        <section className="relative pt-32 pb-10 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-border bg-card">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Subtle Hero Gradients for Premium Look */}
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-green-50 to-[#16A34A]/5 blur-3xl opacity-70" />
            <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-rose-50 to-orange-50/30 blur-3xl opacity-50" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex items-center text-sm font-medium text-muted-foreground mb-8 tracking-wide uppercase"
            >
              <Link href="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
              <span className="mx-3 text-muted-foreground">/</span>
              <span className="text-[#16A34A]">Our Beliefs</span>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
                <motion.h1 
                  variants={fadeUpVariant}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight"
                >
                  Firm Roots & <br className="hidden md:block"/> Timeless Truths
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
                At RCCG Halleluyah House, our beliefs are anchored in the timeless truths of Scripture. They form the foundation of our faith, our vibrant community, and how we live our lives every single day.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* =========================================
            CORE BELIEFS SECTION (BENTO BOX GRID)
        =========================================== */}
        <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h4 variants={fadeUpVariant} className="text-sm font-bold tracking-widest text-[#16A34A] uppercase mb-3">
              The Foundation
            </motion.h4>
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-4xl font-extrabold text-foreground">
              Our Core Beliefs
            </motion.h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {coreBeliefs.map((belief) => (
              <motion.div 
                key={belief.title} 
                variants={fadeUpVariant}
                className="group relative bg-card rounded-3xl p-8 xl:p-10 shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* Decorative Background Gradient Blob */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${belief.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${belief.color} text-white shadow-md mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <belief.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{belief.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{belief.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* =========================================
            STATEMENT OF FAITH CONTINUOUS LIST
        =========================================== */}
        <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 bg-card border-y border-border relative">
          <div className="absolute left-0 top-0 w-[30%] h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none hidden lg:block" />
          
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mb-16 md:mb-24"
            >
              <motion.h4 variants={fadeUpVariant} className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-3">
                Deep Dive
              </motion.h4>
              <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-foreground">
                Statement of Faith
              </motion.h2>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-12 md:space-y-16"
            >
              {statementOfFaith.map((item, index) => (
                <motion.div 
                  variants={fadeUpVariant}
                  key={item.id} 
                  className="flex flex-col md:flex-row gap-6 md:gap-12 group"
                >
                  <div className="md:w-32 flex-shrink-0">
                    <span className="text-5xl md:text-6xl font-black text-muted-foreground/15 group-hover:text-[#16A34A]/20 transition-colors duration-500">
                      {item.id}
                    </span>
                  </div>
                  <div className="flex-1 md:pt-4">
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-[#16A34A] transition-colors">{item.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* =========================================
            JOIN US CTA (BOTTOM)
        =========================================== */}
        <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="bg-[#111827] rounded-[3rem] p-12 lg:p-20 overflow-hidden relative shadow-2xl"
          >
            {/* Background design accents */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#16A34A] rounded-full blur-[80px] opacity-40 mix-blend-screen" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-500 rounded-full blur-[80px] opacity-20 mix-blend-screen" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-center lg:text-left">
                <motion.h4 variants={fadeUpVariant} className="text-[#16A34A] font-bold text-sm tracking-widest uppercase mb-4">
                  Have Questions?
                </motion.h4>
                <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                  Let's discuss our beliefs in more detail.
                </motion.h2>
                <motion.p variants={fadeUpVariant} className="text-xl text-muted-foreground leading-relaxed mb-0">
                  We welcome your questions. Feel free to reach out to our pastoral team.
                </motion.p>
              </div>
              <motion.div variants={fadeUpVariant} className="flex-shrink-0">
                <Link href="/contact">
                  <Button className="bg-[#16A34A] hover:bg-card hover:text-foreground text-white rounded-full px-10 py-8 text-lg font-bold shadow-xl shadow-[#16A34A]/30 transition-all hover:-translate-y-1">
                    Contact Us
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
