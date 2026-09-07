"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"

// Define FAQ data
const faqData = [
  {
    question: "Is RCCG Halleluyah House also RCCG?",
    answer:
      "Yes, RCCG Halleluyah House is a parish of the Redeemed Christian Church of God (RCCG). We operate under the vision and mission of RCCG worldwide while serving our local community.",
  },
  {
    question: "What time does service start?",
    answer:
      "Our Sunday service starts at 9:00 AM and typically ends around 11:30 AM. We recommend arriving 15 minutes early to get settled and enjoy pre-service worship.",
  },
  {
    question: "Is there midweek service?",
    answer:
      "Yes, we have midweek services on Wednesdays from 6:00 PM to 7:30 PM for Bible Study, and on Fridays from 7:00 PM to 9:00 PM for our Prayer Meeting.",
  },
  {
    question: "How do I get there from Police sign board?",
    answer:
      "We are located at 888 E. Belvidere Rd, Suite 403, Grayslake, IL 60030. If you need more specific directions, please contact our office.",
  },
  {
    question: "Is there a bus that can come pick me up?",
    answer:
      "Yes, we offer a church bus service that picks up members from designated locations on Sundays. Please contact our transportation ministry at +234 123 456 7891 or fill out the transportation request form on our website at least 48 hours before the service to arrange pickup.",
  },
  {
    question: "What programs are available for children?",
    answer:
      "We have a vibrant Children's Church for ages 2-12 that runs concurrently with our main service. Our children's program includes age-appropriate Bible lessons, worship, crafts, and activities designed to help children grow in their faith in a fun and engaging environment.",
  },
  {
    question: "How can I become a member?",
    answer:
      "To become a member, you can attend our monthly membership class which is held on the first Sunday of each month after service. Alternatively, you can fill out the 'Become a Member' form in the 'Be a Part of God's Move' section on our website, and our membership team will contact you.",
  },
  {
    question: "What ministries can I join?",
    answer:
      "We have various ministries including Worship, Children's, Youth, Men's, Women's, Prayer, Outreach, Media & Technical, Ushering, Protocol, and Hospitality. You can join by filling out the 'Join the Workforce' form in the 'Be a Part of God's Move' section on our website.",
  },
  {
    question: "How can I give/donate to the church?",
    answer:
      "You can give during our services or online through our website's 'Give' page. We accept various payment methods including bank transfers, cards, and mobile payments. Your generosity helps support our church's mission and ministries.",
  },
  {
    question: "Is counseling available?",
    answer:
      "Yes, our pastoral team offers spiritual counseling by appointment. Please contact the church office at +234 123 456 7890 or email counseling@livingseedchurch.org to schedule a session.",
  },
]

// Message type definition
interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChatbotFAQ() {
  // State for chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm here to answer your questions about RCCG Halleluyah House. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ])

  // State for user input
  const [input, setInput] = useState("")

  // State for chatbot visibility
  const [isOpen, setIsOpen] = useState(false)

  // State for showing/hiding suggested questions
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Ref for message container to auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle sending a message
  const handleSendMessage = (text: string = input) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: text,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Find answer in FAQ data
    setTimeout(() => {
      const faqItem = faqData.find((item) => item.question.toLowerCase().includes(text.toLowerCase()))

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: faqItem
          ? faqItem.answer
          : "I'm sorry, I don't have information on that specific question. Please contact our church office at +234 123 456 7890 for more assistance.",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 500) // Slight delay for natural feel
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage()
  }

  // Handle clicking a suggested question
  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question)
    setShowSuggestions(false)
  }

  // Toggle chatbot visibility
  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <Button
        onClick={toggleChat}
        className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
        aria-label={isOpen ? "Close FAQ chatbot" : "Open FAQ chatbot"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] bg-background border border-border rounded-lg shadow-xl flex flex-col overflow-hidden"
          >
            {/* Chat header */}
            <div className="p-4 border-b border-border bg-primary text-primary-foreground flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                <h3 className="font-bold">Frequently Asked Questions</h3>
              </div>
              <button
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
                aria-label="Close FAQ chatbot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />

              {/* Suggested questions */}
              {showSuggestions && messages.length < 3 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Suggested Questions</p>
                    <button
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className="p-1 rounded-full hover:bg-muted transition-colors"
                      aria-label={showSuggestions ? "Hide suggestions" : "Show suggestions"}
                    >
                      {showSuggestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {faqData.slice(0, 5).map((faq) => (
                      <button
                        key={faq.question}
                        onClick={() => handleSuggestedQuestion(faq.question)}
                        className="w-full text-left p-2 text-sm bg-muted/50 hover:bg-muted rounded-md transition-colors"
                      >
                        {faq.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" className="ml-2" disabled={!input.trim()} aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

