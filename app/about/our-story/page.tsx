"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Target, Mail, Globe, Book, Users, Heart } from "lucide-react"

// Leadership Data (from PastoralTeam.tsx)
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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

export default function OurStoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-card">
      <main className="flex-grow">
        
        {/* === SECTION 1: HEADER & INTRO === */}
        <section className="pt-12 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.h4 variants={fadeInUp} className="text-sm font-bold tracking-widest text-[#16A34A] uppercase mb-4">
              About RCCG Halleluyah House
            </motion.h4>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">
              Empowering the Emerging Generation
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We are a vibrant parish of the Redeemed Christian Church of God in Grayslake, IL. As pastors, leaders, creatives, and believers, we collaborate to raise disciples who will impact their spheres of influence for Christ.
            </motion.p>
          </motion.div>
        </section>

        {/* === SECTION 2: IMAGE MASONRY GRID === */}
        <section className="px-4 sm:px-6 xl:px-0 max-w-6xl mx-auto mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="rounded-3xl overflow-hidden h-[300px] md:h-[400px] md:translate-y-8 shadow-xl">
              <img 
                src="/images/community-service.jpeg" 
                alt="Community service" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="rounded-3xl overflow-hidden h-[300px] md:h-[450px] shadow-xl z-10">
              <img 
                src="/images/worship.jpeg" 
                alt="Worship service" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="rounded-3xl overflow-hidden h-[300px] md:h-[400px] md:translate-y-16 shadow-xl">
              <img 
                src="/images/praise.jpeg" 
                alt="Praising together" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </section>

        {/* === SECTION 3: VALUES & STORY (LEFT/RIGHT LAYOUT) === */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
          <div className="mb-16">
            <h2 className="text-3xl font-extrabold text-foreground">Our identity</h2>
          </div>

          <div className="space-y-24">
            
            {/* The Halleluyah House Story Block */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 lg:order-1 rounded-3xl overflow-hidden shadow-2xl h-[400px]">
                 <img 
                  src="/images/purple-preacher.jpeg" 
                  alt="Preacher" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="order-1 lg:order-2 lg:pl-12">
                <h4 className="text-[#16A34A] font-bold text-sm mb-3">01</h4>
                <h3 className="text-3xl font-bold text-foreground mb-4">The Halleluyah House Story</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  RCCG Halleluyah House was established as a parish of the Redeemed Christian Church of God. What began as a small gathering of believers has grown into a vibrant community of faith. Under the leadership of our pastors and with the guidance of the Holy Spirit, Halleluyah House has become a spiritual home for many, offering a place of worship, fellowship, and spiritual growth.
                </p>
              </div>
            </motion.div>

            {/* Our Mission & Vision Block */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="lg:pr-12">
                <h4 className="text-[#16A34A] font-bold text-sm mb-3">02</h4>
                <h3 className="text-3xl font-bold text-foreground mb-4">Our Mission & Vision</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  We are driven by the core mandate of RCCG Worldwide to make heaven, take as many people with us, and plant churches in every city. We pursue these objectives until every Nation in the world is reached for the Lord Jesus Christ.
                </p>
                <ul className="space-y-3">
                  {[
                    "To Make Heaven",
                    "To take as many people with us",
                    "To have a member of RCCG in every family of all nations"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-foreground font-medium">
                      <Target className="w-5 h-5 mr-3 text-[#16A34A]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px]">
                 <img 
                  src="/images/daddy_adeboye.jpg" 
                  alt="Daddy Adeboye" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>

            {/* Sunday Confession Block */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 lg:order-1 rounded-3xl overflow-hidden shadow-2xl h-[400px] bg-[#16A34A] p-12 flex flex-col justify-center text-white">
                <Heart className="w-12 h-12 mb-8 text-white/80" />
                <p className="text-2xl font-medium leading-snug italic mb-6">
                  "We are living seeds, we emerge in all spheres, they might not see us coming, but they will see us glowing, because we make impact."
                </p>
                <div className="text-white/80 font-medium uppercase tracking-wider text-sm">
                  — The Emerging Generation
                </div>
              </div>
              <div className="order-1 lg:order-2 lg:pl-12">
                <h4 className="text-[#16A34A] font-bold text-sm mb-3">03</h4>
                <h3 className="text-3xl font-bold text-foreground mb-4">Our Sunday Confession</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  This confession is a declaration of our identity and purpose. Each Sunday, we affirm who we are in Christ and our commitment to shine His light in every area of our lives. We are planted in various spheres—business, education, government, and arts—where we grow and produce fruit.
                </p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* === SECTION 4: LEADERSHIP TEAM === */}
        <section className="bg-muted py-32 px-4 sm:px-6 lg:px-8 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h4 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-3">Behind the Vision</h4>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Our Leadership Team</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Working from all around the world to build the church of tomorrow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pastors.map((pastor, i) => (
                <motion.div 
                  key={pastor.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group relative w-full aspect-[4/5] [perspective:1000px]"
                >
                  {/* Inner Flip Container */}
                  <div className="w-full h-full relative transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-md group-hover:shadow-xl rounded-3xl">
                    
                    {/* Front Face - Full Image */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl overflow-hidden bg-card">
                      <img 
                        src={pastor.image} 
                        alt={pastor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Back Face - Contact Info */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-card border border-border flex flex-col items-center justify-center p-8 text-center px-4">
                        {/* Circular Avatar */}
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#16A34A]/20 p-1 mb-6">
                           <div className="w-full h-full rounded-full overflow-hidden relative">
                             <img 
                                src={pastor.image} 
                                alt={pastor.name} 
                                className="w-full h-full object-cover"
                             />
                           </div>
                        </div>

                        {/* Name & Role */}
                        <h3 className="text-xl font-bold text-foreground mb-1">{pastor.name}</h3>
                        <p className="text-sm font-medium text-muted-foreground mb-8 px-2 leading-relaxed">{pastor.role}</p>
                        
                        {/* Social/Contact Links */}
                        <div className="flex gap-4">
                          <a href="#" className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center text-white hover:bg-[#15803D] transition-colors shadow-sm cursor-pointer">
                             <Mail className="w-4 h-4" />
                          </a>
                          <a href="#" className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center text-white hover:bg-[#15803D] transition-colors shadow-sm cursor-pointer">
                             <Globe className="w-4 h-4" />
                          </a>
                          <a href="#" className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center text-white hover:bg-[#15803D] transition-colors shadow-sm cursor-pointer">
                             <Users className="w-4 h-4" />
                          </a>
                        </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* === SECTION 5: JOIN US CTA === */}
        <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h4 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-3">Join The Family</h4>
              <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">Become one of us</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
                Do you want to join our church and grow spiritually? We would love to welcome you. Visit us this Sunday!
              </p>
              <Link href="/contact">
                <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl px-8 py-6 font-semibold shadow-lg shadow-green-200 transition-all hover:-translate-y-1">
                  Plan your visit
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="/images/cta-worship.png" alt="Worship" className="w-full h-48 object-cover rounded-2xl shadow-md" />
                <img src="/images/mother-child.jpeg" alt="Family" className="w-full h-40 object-cover rounded-2xl shadow-md" />
              </div>
              <div className="pt-8">
                <img src="/images/celebration.jpeg" alt="Celebration" className="w-full h-72 object-cover rounded-2xl shadow-md" />
              </div>
            </div>
          </div>
        </section>

      </main>
      {/* Note: The global `<Footer />` has been explicitly removed from here because it is defined in `app/layout.tsx` */}
    </div>
  )
}
