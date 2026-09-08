"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Calendar, MapPin, Heart, BookOpen, Users, Star, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function WomenMinistryPage() {
  const activities = [
    {
      title: "Bible Study & Prayer",
      description: "Deepen your understanding of Scripture and grow in your prayer life through our weekly studies.",
      icon: BookOpen,
      color: "bg-pink-500/10",
    },
    {
      title: "Mentorship Program",
      description: "Connect with experienced women of faith for guidance, encouragement, and spiritual growth.",
      icon: Star,
      color: "bg-purple-500/10",
    },
    {
      title: "Community Outreach",
      description: "Share God's love through various service projects focused on women and children in need.",
      icon: Heart,
      color: "bg-rose-500/10",
    },
    {
      title: "Fellowship Events",
      description: "Build meaningful friendships through retreats, conferences, and social gatherings.",
      icon: Users,
      color: "bg-teal-500/10",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-center bg-cover">
            <img
              src="/images/mother-child.jpeg"
              alt="Women's Ministry at RCCG Halleluyah House"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-900/70 to-purple-900/70"></div>
          </div>

          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-3xl relative z-20">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                Women's Ministry
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-white/90 mb-8"
              >
                Empowering women to discover their God-given purpose, grow in faith, and build meaningful relationships.
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Link href="/contact">
                  <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
                    Join Our Community
                  </Button>
                </Link>
                <Link href="/events">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/20"
                  >
                    Upcoming Events
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Decorative wave divider */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path
                fill="currentColor"
                fillOpacity="1"
                className="text-background"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-10 md:pt-20 relative z-20">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-medium">Women's Ministry</span>
          </div>

          {/* About Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">About Our Women's Ministry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-muted-foreground mb-4">
                  The Women's Ministry at RCCG Halleluyah House is a vibrant community of women from all walks of
                  life who gather to support, encourage, and inspire one another in their faith journey.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  We believe that every woman has been uniquely created by God with gifts, talents, and a purpose.
                  Our ministry provides a safe and nurturing environment where women can discover and develop these
                  gifts while building meaningful relationships.
                </p>
                <p className="text-lg text-muted-foreground">
                  Through Bible studies, prayer groups, mentorship, and fellowship events, we aim to equip women to
                  grow in their relationship with God, strengthen their families, and make a positive impact in
                  their communities.
                </p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Meeting Times</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Monthly Women's Fellowship</h4>
                      <p className="text-muted-foreground">Third Saturday of each month, 10:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Women's Bible Study</h4>
                      <p className="text-muted-foreground">Tuesday mornings, 10:00 AM - 11:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-muted-foreground">888 E. Belvidere Rd, Suite 403, Grayslake, IL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activities Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex bg-background border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`${activity.color} p-6 flex items-center justify-center`}>
                    <activity.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                    <p className="text-muted-foreground">{activity.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Events CTA — links to the real events page rather than inventing dates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 flex items-center justify-between gap-6 rounded-2xl border border-border bg-secondary/20 p-8 flex-wrap"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">Retreats, breakfasts, and Bible study series</h3>
              <p className="text-muted-foreground max-w-xl">
                From our weekly Bible study to occasional retreats and prayer breakfasts, see what's coming up for
                the women of this church.
              </p>
            </div>
            <Link href="/events">
              <Button variant="outline" className="rounded-full">
                See Upcoming Events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Get Involved CTA */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-primary/10 rounded-xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Women's Ministry</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              We invite all women to join our community as we grow together in faith, build meaningful
              relationships, and support one another on our spiritual journey.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">Join Women's Fellowship</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Ministry Leader
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
