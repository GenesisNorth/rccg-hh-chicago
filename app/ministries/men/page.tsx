"use client"

import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Calendar, MapPin, Shield, Users, Briefcase, Award } from "lucide-react"
import { motion } from "framer-motion"

export default function MenMinistryPage() {
  // Men's ministry activities
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
      color: "bg-purple-500/10",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow ">
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
                  <Button className="bg-primary hover:bg-primary/90 text-white">Join Men's Fellowship</Button>
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                    View Events
                  </Button>
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
                    src="/placeholder.svg?height=400&width=600&text=Men's+Ministry"
                    alt="Men's Ministry"
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
            <Link href="/ministries" className="hover:text-primary">
              Ministries
            </Link>
            <span className="mx-2">/</span>
            <Link href="/ministries/men" className="text-primary font-medium">
              Men
            </Link>
          </div>

          {/* About Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">About Our Men's Ministry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-muted-foreground mb-4">
                  The Men's Ministry at Living Seed Church is committed to helping men grow in their relationship with
                  God and fulfill their God-given roles as leaders, husbands, fathers, and servants in the church and
                  community.
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
                      <p className="text-muted-foreground">Fellowship Hall, Church Campus</p>
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

          {/* Leadership Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">Men's Ministry Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Men's Ministry Leader"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Deacon James Nwosu</h3>
                <p className="text-primary font-medium mb-2">Men's Ministry Director</p>
                <p className="text-muted-foreground">
                  Leading our men's ministry with a passion for discipleship and mentoring.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Bible Study Coordinator"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Brother Michael Adekunle</h3>
                <p className="text-primary font-medium mb-2">Bible Study Coordinator</p>
                <p className="text-muted-foreground">Facilitating our weekly Bible studies and discipleship groups.</p>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Events Coordinator"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Brother Paul Okonkwo</h3>
                <p className="text-primary font-medium mb-2">Events Coordinator</p>
                <p className="text-muted-foreground">
                  Organizing retreats, service projects, and fellowship activities.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Upcoming Men's Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-background border border-border rounded-xl overflow-hidden shadow-md"
              >
                <div className="h-48 bg-primary/10">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Men's+Retreat"
                    alt="Men's Retreat"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Annual Men's Retreat</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>September 15-17, 2024</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "Standing Firm" - A weekend of fellowship, teaching, and outdoor activities at Hillside Retreat
                    Center.
                  </p>
                  <Button variant="outline" size="sm">
                    Register Now
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-background border border-border rounded-xl overflow-hidden shadow-md"
              >
                <div className="h-48 bg-primary/10">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Father+Son+Day"
                    alt="Father Son Day"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Father-Son Day</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>July 8, 2024</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    A special day of activities designed to strengthen the bond between fathers and sons of all ages.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-background border border-border rounded-xl overflow-hidden shadow-md"
              >
                <div className="h-48 bg-primary/10">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Men's+Conference"
                    alt="Men's Conference"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Men's Leadership Conference</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>October 5, 2024</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    A one-day conference featuring guest speakers, workshops, and networking opportunities.
                  </p>
                  <Button variant="outline" size="sm">
                    Register
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16 bg-primary/5 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-10 text-center">Men's Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 shadow-md"
              >
                <p className="text-muted-foreground italic mb-4">
                  "The men's ministry has been instrumental in my growth as a husband and father. The accountability and
                  support I've received have helped me become the man God has called me to be."
                </p>
                <div className="flex items-center">
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="Testimonial"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">Thomas Okoro</h3>
                    <p className="text-sm text-muted-foreground">Member for 5 years</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 shadow-md"
              >
                <p className="text-muted-foreground italic mb-4">
                  "As a new Christian, I was looking for guidance and mentorship. The men in this ministry welcomed me,
                  answered my questions, and helped me establish a firm foundation in my faith."
                </p>
                <div className="flex items-center">
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="Testimonial"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">Emmanuel Adebayo</h3>
                    <p className="text-sm text-muted-foreground">Member for 2 years</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

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
              We invite all men to join us as we grow together in faith, character, and leadership. Take the next step
              in your spiritual journey today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg">Join Men's Fellowship</Button>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Ministry Leader
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

