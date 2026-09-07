"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, Globe } from "lucide-react"
import { motion } from "framer-motion"

export default function LeadershipPage() {
  // Leadership team data
  const leadershipTeam = [
    {
      name: "Pastor Samuel Adeyemi",
      role: "Senior Pastor",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pastor Samuel has been leading our congregation for over 15 years with wisdom and compassion. His vision for The Emerging Generation is to raise disciples who will impact their generation for Christ.",
      contact: {
        email: "pastor.samuel@livingseedchurch.org",
        phone: "+234 123 456 7890",
      },
    },
    {
      name: "Pastor Ruth Adeyemi",
      role: "Associate Pastor",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pastor Ruth oversees our women's ministry and children's church. Her passion is to see families grow together in faith and love.",
      contact: {
        email: "pastor.ruth@livingseedchurch.org",
        phone: "+234 123 456 7891",
      },
    },
    {
      name: "Pastor Daniel Okafor",
      role: "Youth Pastor",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pastor Daniel leads our vibrant youth ministry. He is dedicated to mentoring young people and helping them discover their purpose in Christ.",
      contact: {
        email: "pastor.daniel@livingseedchurch.org",
        phone: "+234 123 456 7892",
      },
    },
    {
      name: "Deacon James Nwosu",
      role: "Head of Men's Ministry",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Deacon James leads our men's ministry with a focus on discipleship and mentoring. He is passionate about helping men become godly leaders in their homes and communities.",
      contact: {
        email: "deacon.james@livingseedchurch.org",
        phone: "+234 123 456 7893",
      },
    },
    {
      name: "Deaconess Grace Okonkwo",
      role: "Worship Director",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Deaconess Grace leads our worship ministry with a heart for creating an atmosphere where people can encounter God's presence through music and praise.",
      contact: {
        email: "deaconess.grace@livingseedchurch.org",
        phone: "+234 123 456 7894",
      },
    },
    {
      name: "Elder Emmanuel Adeyemi",
      role: "Church Administrator",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Elder Emmanuel oversees the administrative functions of the church, ensuring that all operations run smoothly to support our various ministries and outreach efforts.",
      contact: {
        email: "elder.emmanuel@livingseedchurch.org",
        phone: "+234 123 456 7895",
      },
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/about/leadership" className="text-primary font-medium">
              Leadership
            </Link>
          </div>

          <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Our Leadership Team</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Meet the dedicated leaders who guide our church with wisdom, compassion, and a commitment to God's Word.
              </p>
            </div>
            <Link href="/" className="mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Leadership Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 pt-8 pb-16">
            {leadershipTeam.map((leader, i) => (
              <motion.div 
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative w-full aspect-[4/5] [perspective:1000px]"
              >
                {/* Inner Flip Container */}
                <div className="w-full h-full relative transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-lg hover:shadow-2xl rounded-3xl">
                  
                  {/* Front Face: Full Bleed Image */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl overflow-hidden bg-card border border-border">
                    <img 
                      src={leader.image || "/placeholder.svg"} 
                      alt={leader.name} 
                      className="w-full h-full object-cover"
                    />
                    {/* Dark gradient overlay for name legibility */}
                    <div className="absolute inset-x-0 bottom-0 py-8 px-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end">
                      <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{leader.name}</h3>
                      <p className="text-green-200 font-medium drop-shadow-md">{leader.role}</p>
                    </div>
                  </div>

                  {/* Back Face: Bio and Contact Info */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-card border border-border shadow-inner flex flex-col items-center justify-center p-8 text-center sm:px-4">
                      {/* Circular Avatar */}
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#16A34A]/20 p-1 mb-4 md:mb-6 shadow-sm">
                         <div className="w-full h-full rounded-full overflow-hidden relative">
                           <img 
                              src={leader.image || "/placeholder.svg"} 
                              alt={leader.name} 
                              className="w-full h-full object-cover"
                           />
                         </div>
                      </div>

                      {/* Name & Role */}
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">{leader.name}</h3>
                      <p className="text-[#16A34A] font-semibold text-sm mb-4">{leader.role}</p>
                      
                      {/* Bio Snippet */}
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-4 md:line-clamp-none">
                        {leader.bio}
                      </p>
                      
                      {/* Contact Links */}
                      <div className="flex gap-4">
                        <a href={`mailto:${leader.contact.email}`} className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-white hover:bg-[#16A34A] hover:scale-110 transition-all shadow-md cursor-pointer">
                           <Mail className="w-4 h-4" />
                        </a>
                        <a href={`tel:${leader.contact.phone}`} className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-white hover:bg-[#16A34A] hover:scale-110 transition-all shadow-md cursor-pointer">
                           <Phone className="w-4 h-4" />
                        </a>
                      </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 bg-secondary/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Interested in Serving?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              We believe every member has gifts and talents that can contribute to the life of our church. If you're
              interested in serving in any capacity, we'd love to hear from you.
            </p>
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </main>

    </div>
  )
}

