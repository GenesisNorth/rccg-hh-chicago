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
      color: "bg-blue-500/10",
    },
    {
      title: "Leadership Development",
      description: "Equipping men to lead with integrity in their homes, workplaces, and communities.",
      icon: Award,
      color: "bg-amber-500/10",
    },
    {
      title: "Professional Networking",
      description: "Connect with other Christian men for mentorship, career guidance, and business opportunities.",
      icon: Briefcase,
      color: "bg-emerald-500/10",
    },
    {
      title: "Fellowship & Recreation",
      description: "Build meaningful friendships through social events, sports activities, and retreats.",
      icon: Users,
      color: "bg-teal-500/10",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-700 py-10 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0 relative z-20">
                <motion.h1
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl font-bold text-white mb-4"
                >
                  Men's Ministry
                </motion.h1>
                <motion.p
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl text-white/90 max-w-lg"
                >
                  Building men of character, integrity, and purpose who lead their families and communities with godly
                  wisdom.
                </motion.p>
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mt-8 flex flex-wrap gap-4"
                >
                  <Link href="/contact">
                    <Button className="bg-primary hover:bg-primary/90 text-white">Join Men's Fellowship</Button>
                  </Link>
                  <Link href="/events">
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                      View Events
                    </Button>
                  </Link>
                </motion.div>
              </div>
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2"
              >
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/images/preacher-podium.jpeg"
                    alt="Men's Ministry at RCCG Halleluyah House"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative shape divider */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path
                fill="currentColor"
                fillOpacity="1"
                className="text-background"
                d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
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
            <span className="text-primary font-medium">Men's Ministry</span>
          </div>

          {/* About Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">About Our Men's Ministry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-muted-foreground mb-4">
                  The Men's Ministry at RCCG Halleluyah House is committed to helping men grow in their relationship
                  with God and fulfill their God-given roles as leaders, husbands, fathers, and servants in the
                  church and community.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  We provide opportunities for men to connect with one another, study God's Word, develop leadership
                  skills, and serve together. Our goal is to equip men to live out their faith with courage and
                  integrity in every area of life.
                </p>
                <p className="text-lg text-muted-foreground">
                  Whether you're a seasoned believer or just beginning your faith journey, there's a place for you in
                  our men's ministry.
                </p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Meeting Times</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Monthly Men's Breakfast</h4>
                      <p className="text-muted-foreground">First Saturday of each month, 8:00 AM - 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Men's Bible Study</h4>
                      <p className="text-muted-foreground">Wednesday evenings, 7:00 PM - 8:30 PM</p>
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
              <h3 className="text-2xl font-bold mb-2">Retreats, breakfasts, and more</h3>
              <p className="text-muted-foreground max-w-xl">
                From our monthly breakfast to occasional retreats and conferences, see what's coming up for the men
                of this church.
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
            <h2 className="text-3xl font-bold mb-4">Join Our Men's Ministry</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              We invite all men to join us as we grow together in faith, character, and leadership. Take the next
              step in your spiritual journey today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">Join Men's Fellowship</Button>
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
