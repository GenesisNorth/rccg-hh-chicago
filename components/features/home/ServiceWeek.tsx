// \"use client\"

// import { Heart, Music, BookOpen, Users } from \"lucide-react\"
// import { motion, useReducedMotion } from \"framer-motion\"
// import { Button } from \"@/components/ui/button\"
// import MinistryCard from \"./MinistryCard\"
// import { useId } from \"react\"\

// // Define ministry data
// const ministries = [
//   {
//     name: \"Worship\",
//     description: \"Experience the presence of God through annointed praise and worship led by our dedicated team.\",
//     icon: Music,
//     image: \"/images/keyboard-worship.jpeg\",
//     // additionalImage: \"/images/worship-team.jpeg\",
//     color: \"from-purple-500/20 to-indigo-500/20\",
//   },
//   {
//     name: \"Bible Study\",
//     description: \"Deepen your understanding of God's word through our engaging and transformative Bible studies.\",
//     icon: BookOpen,
//     image: \"/images/preacher-podium.jpeg\",
//     color: \"from-blue-500/20 to-cyan-500/20\",
//   },
//   {
//     name: \"Outreach & Missions\",
//     description: \"Join us as we share God's love with our community and beyond through various outreach programs.\",
//     icon: Heart,
//     image: \"/images/community-service.jpeg\",
//     color: \"from-rose-500/20 to-orange-500/20\",
//   },
//   {
//     name: \"Youth Fellowship\",
//     description: \"A vibrant community where young people grow in faith and build lasting relationships.\",
//     icon: Users,
//     image: \"/images/purple-preacher.jpeg\",
//     color: \"from-emerald-500/20 to-teal-500/20\",
//   },
// ]

// export default function EnhancedMinistries() {
//   // Generate unique IDs for accessibility
//   const sectionId = useId()
//   const headingId = useId()
//   const descriptionId = useId()

//   // Check if user prefers reduced motion
//   const prefersReducedMotion = useReducedMotion()

//   return (
//     <section className=\"py-12 md:py-24 bg-background relative overflow-hidden\" id=\"ministries\" aria-labelledby={headingId}>
//       {/* Background elements - only animate if user doesn't prefer reduced motion */}
//       {!prefersReducedMotion && (
//         <div className=\"absolute inset-0 overflow-hidden pointer-events-none\">
//           <motion.div
//             className=\"absolute -top-1/2 -right-1/4 w-1/2 h-1/2 bg-primary-light rounded-full\"
//             animate={{
//               scale: [1, 1.1, 1],
//               rotate: [0, 45, 0],
//             }}
//             transition={{
//               duration: 15,
//               repeat: Number.POSITIVE_INFINITY,
//               ease: \"linear\",
//             }}
//             aria-hidden=\"true\"
//           />
//           <motion.div
//             className=\"absolute -bottom-1/2 -left-1/4 w-1/2 h-1/2 bg-secondary-light rounded-full\"
//             animate={{
//               scale: [1, 1.2, 1],
//               rotate: [0, -45, 0],
//             }}
//             transition={{
//               duration: 20,
//               repeat: Number.POSITIVE_INFINITY,
//               ease: \"linear\",
//             }}
//             aria-hidden=\"true\"
//           />
//         </div>
//       )}

//       <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10\">
//         <div className=\"text-center\" aria-describedby={descriptionId}>
//           <motion.h2
//             className=\"text-base text-primary font-semibold tracking-wide uppercase\"
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             viewport={{ once: true }}
//           >
//             Who we Are
//           </motion.h2>
//           <motion.h3
//             id={headingId}
//             className=\"mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl\"
//             initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             viewport={{ once: true }}
//           >
//             Growing Together in Faith
//           </motion.h3>
//           <motion.p
//             id={descriptionId}
//             className=\"mt-4 max-w-2xl text-xl text-muted-foreground mx-auto\"
//             initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             viewport={{ once: true }}
//           >
//             RCCG LSC Abuja is a vibrant family of believers under the Redeemed Christian Church of God Worldwide. 
//           </motion.p>
//         </div>

//         <div className=\"mt-16 grid gap-8 md:grid-cols-2\" aria-labelledby={headingId}>
//           {ministries.map((ministry, index) => (
//             <MinistryCard
//               key={ministry.name}
//               name={ministry.name}
//               description={ministry.description}
//               icon={ministry.icon}
//               image={ministry.image}
//               // additionalImage={ministry.additionalImage}
//               color={ministry.color}
//               index={index}
//             />
//           ))}
//         </div>
// {/* 
//         <motion.div
//           className=\"mt-12 text-center\"
//           initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.6 }}
//           viewport={{ once: true }}
//         >
//           <Button
//             size=\"lg\"
//             className=\"mt-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2\"
//           >
//             View All Ministries
//           </Button>
//         </motion.div> */}
//       </div>
//     </section>
//   )
// }




"use client"

import { Heart, Music, BookOpen, Users, Clock } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useId } from "react"
import MyLSCStory from "@/components/features/about/MyLSCStory"

// Define ministry data matching Figma
const ministries = [
  {
    name: "Seek ye first",
    time: "5:30 - 6:30 a.m",
    description: "Join us for our early morning prayers that happens every first day of the month, every monday of the week, this is a place where we seek God's face as a church and commit the week into his hands",
    image: "/images/keyboard-worship.jpeg",
    bgColor: "",
  },
  {
    name: "Wednesday - Bible Study",
    time: "6:00 - 7:30 pm",
    description: "Join us very Wednesday where we look in deeply at the word of God, discuss and digest it; raise question pertaining to our Christian faith and most importantly, learn to be better Christians",
    image: "/images/preacher-podium.jpeg",
    bgColor: "",
  },
  {
    name: "Saturday - Prayer Meetings",
    time: "5:30 - 8:00 pm",
    description: "What's a life without prayers? We exercise our prayer life by praying with other believer's, hence, do not miss out on our saturday prayer meetings.",
    image: "/images/community-service.jpeg",
    bgColor: "",
  },
  {
    name: "Sunday Service",
    time: "8:00 - 11:00 am",
    description: `David said "I was glad when they said to me, let us go to the house of the Lord." That is the heart of every member here, and we want you to be a part of it. Join us this Sunday!`,
    image: "/images/purple-preacher.jpeg",
    bgColor: "",
  },
]

interface Ministry {
  name: string
  time: string
  description: string
  image: string
  bgColor: string
}

interface MinistryCardProps {
  ministry: Ministry
  index: number
  prefersReducedMotion: boolean
}

function MinistryCard({ ministry, index, prefersReducedMotion }: MinistryCardProps) {
  return (
    <motion.div
      className="relative group cursor-pointer h-full"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden rounded-3xl h-full shadow-xl">
        {/* Image Background */}
        <div className="relative h-full min-h-[400px]">
          <img
            src={ministry.image}
            alt={ministry.name}
            className="w-full h-full object-cover"
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
            {/* Title and Time */}
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                {/* <h3 className="text-white text-xl sm:text-2xl font-bold flex-1">{ministry.name}</h3> */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 self-start sm:self-auto shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-sm text-white font-medium whitespace-nowrap">{ministry.time}</span>
                </div>
              </div>
            </div>
            
            {/* Description Box */}
            <div className={`${ministry.bgColor} rounded-2xl p-10 bg-white/20 backdrop-blur-sm px-4 py-6 border border-white/30 self-start sm:self-auto shrink-0`}>
             <h3 className="text-white text-xl sm:text-2xl font-bold flex-1">{ministry.name}</h3>
              <p className="text-white text-sm leading-relaxed">
                {ministry.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function EnhancedMinistries() {
  const headingId = useId()
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-12 md:py-24 bg-card relative overflow-hidden" id="ministries" aria-labelledby={headingId}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h3
            id={headingId}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            A peek into what a conventional week is like
          </motion.h3>
        </div>

        {/* Grid Layout - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-labelledby={headingId}>
          {ministries.map((ministry, index) => (
            <MinistryCard 
              key={ministry.name}
              ministry={ministry} 
              index={index} 
              prefersReducedMotion={prefersReducedMotion ?? false} 
            />
          ))}
        </div>

        <MyLSCStory />
      </div>
    </section>
  )
}