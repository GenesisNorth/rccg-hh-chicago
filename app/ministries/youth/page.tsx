"use client"


import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Calendar, MapPin, Music, Users, Heart, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

export default function YouthMinistryPage() {
  // Youth activities
  const activities = [
    {
      title: "Worship & Praise",
      description: "Experience vibrant, youth-led worship that connects hearts to God through contemporary music.",
      icon: Music,
      color: "bg-purple-500/10",
    },
    {
      title: "Bible Study",
      description: "Engage with Scripture in relevant, discussion-based studies that apply to real-life situations.",
      icon: BookOpen,
      color: "bg-blue-500/10",
    },
    {
      title: "Community Service",
      description: "Put faith into action through regular outreach and service projects in our local community.",
      icon: Heart,
      color: "bg-rose-500/10",
    },
    {
      title: "Fellowship",
      description: "Build lasting friendships through social events, game nights, retreats, and shared meals.",
      icon: Users,
      color: "bg-emerald-500/10",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow ">
        {/* Hero Section with Parallax Effect */}
        <div className="relative h-[60vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-fixed bg-center bg-cover"
            style={{
              backgroundImage: "url('/placeholder.svg?height=800&width=1600&text=Youth+Ministry')",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-3xl relative z-20">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                Youth Ministry
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-white/90 mb-8"
              >
                Empowering the next generation to discover their purpose, develop their faith, and make a difference in
                their world.
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Join Our Youth Group
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/20"
                >
                  Upcoming Events
                </Button>
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
            <Link href="/ministries" className="hover:text-primary">
              Ministries
            </Link>
            <span className="mx-2">/</span>
            <Link href="/ministries/youth" className="text-primary font-medium">
              Youth
            </Link>
          </div>

          {/* About Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">About Our Youth Ministry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-muted-foreground mb-4">
                  The Emerging Generation Youth Ministry at Living Seed Church is a vibrant community of young people
                  aged 13-25 who are passionate about growing in their faith and making a positive impact in the world.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  Our youth ministry provides a safe, welcoming environment where teenagers and young adults can explore
                  their faith, ask tough questions, build meaningful relationships, and discover their God-given
                  purpose.
                </p>
                <p className="text-lg text-muted-foreground">
                  Through dynamic worship, relevant teaching, small groups, and service opportunities, we equip young
                  people to live out their faith in every area of life.
                </p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Youth Service Times</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Sunday Youth Service</h4>
                      <p className="text-muted-foreground">4:00 PM - 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Friday Youth Night</h4>
                      <p className="text-muted-foreground">6:30 PM - 8:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-muted-foreground">Youth Center, Church Campus</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activities Section with Staggered Animation */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">What We Do</h2>
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

          {/* Testimonials Section */}
          <div className="mb-16 bg-primary/5 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-10 text-center">Youth Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="Youth testimonial"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">David, 17</h3>
                    <p className="text-sm text-muted-foreground">Member for 2 years</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "The youth ministry has completely transformed my life. I've found friends who encourage me in my
                  faith and leaders who genuinely care about my spiritual growth."
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="Youth testimonial"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">Sarah, 19</h3>
                    <p className="text-sm text-muted-foreground">Member for 3 years</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "Being part of this youth group has helped me navigate the challenges of college while staying strong
                  in my faith. The mentorship I've received has been invaluable."
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="Youth testimonial"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">Michael, 16</h3>
                    <p className="text-sm text-muted-foreground">Member for 1 year</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "I was hesitant to join at first, but this youth group has become like a second family to me. The
                  Bible studies are relevant to my life, and I've grown so much in my faith."
                </p>
              </motion.div>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">Youth Leadership Team</h2>
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
                    alt="Youth Pastor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Pastor Daniel Okafor</h3>
                <p className="text-primary font-medium mb-2">Youth Pastor</p>
                <p className="text-muted-foreground">
                  Leading our youth ministry with passion and vision for the next generation.
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
                    alt="Youth Coordinator"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Sister Joy Nnamdi</h3>
                <p className="text-primary font-medium mb-2">Youth Coordinator</p>
                <p className="text-muted-foreground">
                  Organizing events and programs that engage and inspire our youth.
                </p>
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
                    alt="Worship Leader"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Brother Joshua Adeyemi</h3>
                <p className="text-primary font-medium mb-2">Worship Leader</p>
                <p className="text-muted-foreground">
                  Leading our youth in powerful worship experiences that draw hearts to God.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Upcoming Youth Events</h2>
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
                    src="/placeholder.svg?height=200&width=400&text=Youth+Retreat"
                    alt="Youth Retreat"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Annual Youth Retreat</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>June 15-17, 2024</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    A weekend of spiritual renewal, fellowship, and fun activities at Sunshine Resort.
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
                    src="/placeholder.svg?height=200&width=400&text=Youth+Conference"
                    alt="Youth Conference"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Youth Conference</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>August 5-7, 2024</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "Ignite Your Purpose" - A three-day conference featuring guest speakers, workshops, and worship.
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
                    src="/placeholder.svg?height=200&width=400&text=Community+Service"
                    alt="Community Service"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Community Service Day</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>July 22, 2024</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Join us as we serve our local community through various outreach projects and initiatives.
                  </p>
                  <Button variant="outline" size="sm">
                    Sign Up
                  </Button>
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
            <h2 className="text-3xl font-bold mb-4">Join Our Youth Ministry</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Whether you're a teenager looking for a place to belong or a parent interested in our youth programs, we'd
              love to connect with you!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg">Register for Youth Group</Button>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Youth Pastor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  )
}

