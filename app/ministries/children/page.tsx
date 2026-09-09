"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Calendar, Heart, Star, Users } from "lucide-react"

export default function ChildrenMinistryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-card selection:bg-[#16A34A]/20">
      
      <main className="flex-grow pt-12 md:pt-24 pb-16">
        
        {/* === HERO SECTION === */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 md:mb-32 mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <h4 className="text-[#16A34A] font-bold tracking-widest text-sm uppercase mb-4">Children's Ministry</h4>
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
              Nurturing <br className="hidden md:block"/> Young Hearts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              We believe children are not just the church of tomorrow, but an important part of the church today. A safe, fun environment to learn about God's love.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="w-full sm:w-auto rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-[#16A34A]/30 transition-all hover:scale-105">
                Register Your Child
              </Button>
            </div>
          </motion.div>
        </section>

        {/* === AUTO-SCROLLING GALLERY CAROUSEL === */}
        <section className="w-full overflow-hidden py-10 mb-20 md:mb-32">
          {/* 
            Container with hidden overflow on X.
            Framer motion sliding x from 0% to -50% across a duplicated array ensures a perfect seamless loop. 
          */}
          <div className="relative flex select-none pointer-events-none">
            <motion.div
              className="flex gap-4 md:gap-6 pr-4 md:pr-6 shrink-0"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 40,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {/* Doubled List for Seamless Infinite Loop */}
              {[
                { src: "/images/celebration.jpeg", alt: "Church Celebration" },
                { src: "/images/preaching.jpeg", alt: "Sunday Service" },
                { src: "/images/keyboard-worship.jpeg", alt: "Worship Team" },
                { src: "/images/community-service.jpeg", alt: "Community Service" },
                { src: "/images/praise.jpeg", alt: "Praise & Worship" },
                { src: "/images/preacher-podium.jpeg", alt: "Preacher at the Podium" },
                { src: "/images/worship.jpeg", alt: "Worship Service" },
                { src: "/images/mother-child.jpeg", alt: "Mother and Child" },
                // Repeated block
                { src: "/images/celebration.jpeg", alt: "Church Celebration" },
                { src: "/images/preaching.jpeg", alt: "Sunday Service" },
                { src: "/images/keyboard-worship.jpeg", alt: "Worship Team" },
                { src: "/images/community-service.jpeg", alt: "Community Service" },
                { src: "/images/praise.jpeg", alt: "Praise & Worship" },
                { src: "/images/preacher-podium.jpeg", alt: "Preacher at the Podium" },
                { src: "/images/worship.jpeg", alt: "Worship Service" },
                { src: "/images/mother-child.jpeg", alt: "Mother and Child" },
              ].map((photo, i) => (
                <div 
                  key={`${photo.src}-${i}`} 
                  className="w-72 sm:w-96 md:w-[420px] lg:w-[480px] h-64 sm:h-80 md:h-[400px] lg:h-[450px] rounded-[2rem] overflow-hidden shadow-xl border-2 border-white shrink-0"
                >
                  <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* === ABOUT THE MINISTRY (Left/Right) === */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6 }}
            >
               <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                 Growing in Faith, <br/> Bound by Love.
               </h2>
               <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Our dedicated team of trained volunteers is passionate about nurturing the spiritual development of each child through age-appropriate Bible lessons, worship, games, and creative activities.
               </p>
               <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  We work in partnership with parents, providing resources and support to help families continue faith conversations at home. Every volunteer undergoes background checks to ensure maximum safety.
               </p>
               
               <ul className="space-y-4">
                 {[
                   { icon: Heart, text: "Safe & loving environment" },
                   { icon: Star, text: "Interactive Bible lessons" },
                   { icon: Users, text: "Dedicated, vetted volunteers" },
                 ].map((item, i) => (
                   <li key={i} className="flex items-center text-foreground font-semibold text-lg">
                     <div className="w-10 h-10 rounded-full bg-[#16A34A]/10 flex items-center justify-center mr-4">
                       <item.icon className="w-5 h-5 text-[#16A34A]" />
                     </div>
                     {item.text}
                   </li>
                 ))}
               </ul>
            </motion.div>

            <motion.div
               className="bg-muted rounded-[3rem] p-10 md:p-14 border border-border shadow-xl"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6, delay: 0.2 }}
            >
               <h3 className="text-2xl font-bold text-foreground mb-8">Service Times</h3>
               
               <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-2xl bg-card shadow-sm flex items-center justify-center mr-5 shrink-0">
                      <Calendar className="w-6 h-6 text-[#16A34A]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">Sunday Services</h4>
                      <p className="text-muted-foreground mt-1">9:00 AM - 11:30 AM <br/>(Simultaneous with Main Service)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-2xl bg-card shadow-sm flex items-center justify-center mr-5 shrink-0">
                      <Clock className="w-6 h-6 text-[#16A34A]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">Wednesday Bible Club</h4>
                      <p className="text-muted-foreground mt-1">6:00 PM - 7:30 PM</p>
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* === AGE GROUPS === */}
        <section className="bg-muted py-32 border-y border-border">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                 <h2 className="text-4xl font-extrabold text-foreground mb-4">Our Age Groups</h2>
                 <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tailored environments designed specifically for your child's developmental stage.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { title: "Toddlers", age: "Ages 2-4", desc: "Introducing young children to basic Bible stories through play, songs, and simple crafts." },
                   { title: "Elementary", age: "Ages 5-8", desc: "Interactive lessons, games, and age-appropriate worship to build a strong foundation." },
                   { title: "Pre-Teens", age: "Ages 9-12", desc: "Deepening understanding of faith through discussions, Bible study, and service." },
                 ].map((group, i) => (
                   <motion.div 
                     key={group.title}
                     className="bg-card rounded-[2rem] p-10 shadow-lg border border-border hover:shadow-xl transition-shadow relative overflow-hidden group"
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-50px" }}
                     transition={{ duration: 0.5, delay: i * 0.15 }}
                   >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#16A34A]/5 to-transparent rounded-bl-full transition-transform group-hover:scale-110"></div>
                      <span className="inline-block px-4 py-1.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] font-bold text-sm tracking-wide mb-6">
                        {group.age}
                      </span>
                      <h3 className="text-2xl font-bold text-foreground mb-4">{group.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {group.desc}
                      </p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* === FEATURED IMAGE MASONRY === */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <motion.div 
                className="md:col-span-7 h-[450px] md:h-[650px] rounded-[2rem] overflow-hidden shadow-2xl relative group"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <img src="/images/mother-child.jpeg" alt="Mother and Child" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </motion.div>

              <div className="md:col-span-5 flex flex-col gap-6">
                <motion.div 
                  className="h-[215px] md:h-[310px] rounded-[2rem] overflow-hidden shadow-xl group"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <img src="/images/celebration.jpeg" alt="Kids Celebration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </motion.div>
                <motion.div 
                  className="h-[215px] md:h-[310px] rounded-[2rem] overflow-hidden shadow-xl group"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <img src="/images/community-service.jpeg" alt="Community Activities" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </motion.div>
              </div>
           </div>
        </section>

        {/* === CTA SECTION === */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="bg-[#111827] rounded-[3rem] p-12 md:p-20 relative overflow-hidden"
            >
               {/* Abstract background shapes */}
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                 <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#16A34A]/20 rounded-full blur-3xl"></div>
                 <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#15803D]/20 rounded-full blur-3xl"></div>
               </div>

               <div className="relative z-10">
                 <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Partner With Us</h2>
                 <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                   Looking for passionate volunteers to serve as teachers, worship leaders, and check-in assistants. Join the team shaping the next generation.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   <Button className="w-full sm:w-auto rounded-full bg-[#16A34A] hover:bg-card hover:text-foreground text-white px-8 py-6 text-lg font-semibold transition-colors">
                     Apply to Volunteer
                   </Button>
                   <Link href="/contact" className="w-full sm:w-auto">
                     <Button variant="outline" className="w-full sm:w-auto rounded-full border-gray-600 bg-transparent text-white hover:bg-gray-800 px-8 py-6 text-lg font-semibold transition-colors">
                       Contact Director
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
