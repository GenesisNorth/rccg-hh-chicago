"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, PlayCircle, Headphones, ChevronLeft, Play, Pause, Volume2, VolumeX, User, Clock, BookOpen, Download, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { useParams } from "next/navigation"

// Sample sermon data
const sermons = [
  {
    id: 1,
    title: "Finding Purpose in God's Plan",
    speaker: "Pastor Samuel Adeyemi",
    date: "2023-12-10",
    duration: "45:18",
    series: "Purpose Driven Life",
    scripture: "Jeremiah 29:11-13",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Sermon+1",
    audioUrl: "#",
    videoUrl: "#",
    description:
      "In this powerful message, Pastor Samuel explores how we can discover and fulfill God's unique purpose for our lives. Drawing from Jeremiah 29:11-13, he shares practical insights on recognizing God's voice and following His direction.",
    tags: ["purpose", "faith", "guidance"],
    featured: true,
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
      <h3>Key Points</h3>
      <ul>
        <li>God has a unique purpose for each of us</li>
        <li>Our purpose is connected to our gifts and passions</li>
        <li>Discovering purpose requires seeking God</li>
        <li>Living purposefully brings fulfillment</li>
      </ul>
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
      <blockquote>
        "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future." - Jeremiah 29:11
      </blockquote>
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
    `,
    relatedSermons: [2, 3, 7],
  },
  {
    id: 2,
    title: "The Power of Prayer",
    speaker: "Pastor Ruth Adeyemi",
    date: "2023-12-03",
    duration: "38:42",
    series: "Prayer Warriors",
    scripture: "Matthew 6:5-13",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Sermon+2",
    audioUrl: "#",
    videoUrl: "#",
    description:
      "Pastor Ruth teaches on the transformative power of prayer in the believer's life. Learn how to develop a consistent prayer life and experience breakthrough in your spiritual journey.",
    tags: ["prayer", "spiritual growth", "discipline"],
    featured: true,
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
      <h3>Key Points</h3>
      <ul>
        <li>Prayer is communication with God</li>
        <li>Consistency is key to an effective prayer life</li>
        <li>Prayer changes things and changes us</li>
        <li>Different types of prayer for different situations</li>
      </ul>
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
      <blockquote>
        "And when you pray, do not be like the hypocrites, for they love to pray standing in the synagogues and on the street corners to be seen by others." - Matthew 6:5
      </blockquote>
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
    `,
    relatedSermons: [1, 5, 6],
  },
]

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default function SermonDetailPage() {
  const params = useParams()
  const sermonId = Number.parseInt(params.id as string)

  const [sermon, setSermon] = useState<(typeof sermons)[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [relatedSermons, setRelatedSermons] = useState<typeof sermons>([])

  // Fetch sermon data
  useEffect(() => {
    const foundSermon = sermons.find((s) => s.id === sermonId)
    if (foundSermon) {
      setSermon(foundSermon)

      // Get related sermons
      if (foundSermon.relatedSermons) {
        const related = sermons.filter((s) => foundSermon.relatedSermons.includes(s.id))
        setRelatedSermons(related)
      }
    }
  }, [sermonId])

  // Simulate sermon playback
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsPlaying(false)
            return 100
          }
          return prev + 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isPlaying])

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  if (!sermon) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Sermon not found</h2>
              <p className="text-muted-foreground mb-6">
                The sermon you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/sermons">
                <Button>Back to Sermons</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

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
            <Link href="/sermons" className="hover:text-primary">
              Sermons
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-medium">{sermon.title}</span>
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <Link href="/sermons">
              <Button variant="outline" size="sm" className="flex items-center">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back to Sermons
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-background border border-border rounded-xl overflow-hidden shadow-md"
              >
                {/* Sermon Video/Image */}
                <div className="aspect-video bg-muted relative">
                  <img
                    src={sermon.thumbnail || "/placeholder.svg"}
                    alt={sermon.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      onClick={togglePlayPause}
                      className="bg-primary text-primary-foreground rounded-full p-4 transform hover:scale-110 transition-transform duration-300"
                      aria-label={isPlaying ? "Pause sermon" : "Play sermon"}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                  </div>
                </div>

                {/* Audio Player */}
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlayPause}
                      className="bg-primary text-primary-foreground rounded-full p-2"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>

                    <div className="flex-grow">
                      <Slider
                        value={[currentProgress]}
                        max={100}
                        step={1}
                        className="w-full"
                        onValueChange={(value) => setCurrentProgress(value[0])}
                      />
                    </div>

                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {Math.floor((currentProgress / 100) * Number.parseInt(sermon.duration.split(":")[0]))
                        .toString()
                        .padStart(2, "0")}
                      :
                      {Math.floor(((currentProgress / 100) * Number.parseInt(sermon.duration.split(":")[1])) % 60)
                        .toString()
                        .padStart(2, "0")}{" "}
                      /{sermon.duration}
                    </span>

                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Sermon Content */}
                <div className="p-6">
                  <h1 className="text-3xl font-bold mb-4">{sermon.title}</h1>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      <span>{sermon.speaker}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(sermon.date)}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{sermon.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-primary font-medium mb-6 bg-primary/5 p-2 rounded inline-block">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{sermon.scripture}</span>
                  </div>

                  <div
                    className="prose prose-lg dark:prose-invert max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: sermon.content }}
                  />

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {sermon.tags.map((tag) => (
                      <span key={tag} className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="flex items-center">
                      <Download className="mr-2 h-4 w-4" /> Download Audio
                    </Button>
                    <Button variant="outline" className="flex items-center">
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Series Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-background border border-border rounded-xl overflow-hidden shadow-md mb-6"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">Part of Series</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">{sermon.series}</h3>
                      <Link
                        href={`/sermons?series=${encodeURIComponent(sermon.series)}`}
                        className="text-primary text-sm hover:underline"
                      >
                        View all sermons in this series
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Related Sermons */}
              {relatedSermons.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-background border border-border rounded-xl overflow-hidden shadow-md"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Related Sermons</h2>
                    <div className="space-y-4">
                      {relatedSermons.map((relatedSermon) => (
                        <Link href={`/sermons/${relatedSermon.id}`} key={relatedSermon.id}>
                          <div className="flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                            <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={relatedSermon.thumbnail || "/placeholder.svg"}
                                alt={relatedSermon.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-bold line-clamp-2">{relatedSermon.title}</h3>
                              <p className="text-sm text-muted-foreground">{relatedSermon.speaker}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(relatedSermon.date)}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}

