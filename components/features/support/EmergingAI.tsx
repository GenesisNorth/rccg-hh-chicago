"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X, ArrowLeft, RotateCcw, Bot, Sparkles } from "lucide-react"

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
  {
    question: "What are the tribes in LSC?",
    answer:
      "At LSC, we organize our members into 12 tribes based on the 12 tribes of Israel, corresponding to birth months. January is Reuben, February is Simeon, and so on. These tribes serve as small groups for fellowship, prayer, and community support.",
  },
  {
    question: "Do you have online services?",
    answer:
      "Yes, we stream our services live on our YouTube channel, Facebook page, and Instagram. You can access these streams through the links on our website's homepage. Past sermons are also available in our online sermon library.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes, we have ample parking space available on our church premises. We also have designated parking attendants to help direct you on Sundays.",
  },
  {
    question: "What should I wear to church?",
    answer:
      "We have no strict dress code. Many members dress in smart casual or formal attire, but we welcome you to come as you are. Our focus is on worship and fellowship rather than outward appearance.",
  },
  {
    question: "Do you have a youth program?",
    answer:
      "Yes, our youth ministry 'The Emerging Generation Youth' meets every Sunday at 4:00 PM. We also have special youth events, retreats, and weekly Friday youth nights at 6:30 PM.",
  },
]

// Define categories for questions
const categories = [
  { id: "services", name: "Service Times", icon: "🕒" },
  { id: "location", name: "Location & Transport", icon: "🚌" },
  { id: "programs", name: "Programs & Ministries", icon: "👪" },
  { id: "membership", name: "Membership", icon: "📝" },
  { id: "giving", name: "Giving & Support", icon: "💰" },
]

// Map questions to categories
const questionsByCategory = {
  services: ["What time does service start?", "Is there midweek service?", "Do you have online services?"],
  location: [
    "How do I get there from Police sign board?",
    "Is there a bus that can come pick me up?",
    "Is there parking available?",
  ],
  programs: [
    "What programs are available for children?",
    "Do you have a youth program?",
    "What are the tribes in LSC?",
  ],
  membership: ["How can I become a member?", "Is RCCG Halleluyah House also RCCG?", "What should I wear to church?"],
  giving: ["How can I give/donate to the church?", "What ministries can I join?", "Is counseling available?"],
}

// Message type definition
interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  options?: string[]
  category?: string
}

// Conversation history type
interface ConversationState {
  messages: Message[]
  currentIndex: number
}

export default function EmergingAI() {
  // State for conversation history
  const [conversationHistory, setConversationHistory] = useState<ConversationState[]>([
    {
      messages: [
        {
          id: "welcome",
          text: "Hello! I'm EMERGING AI, your virtual assistant for RCCG Halleluyah House. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
          options: ["Browse by category", "Ask a question"],
        },
      ],
      currentIndex: 0,
    },
  ])

  // Current conversation state
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0)
  const currentConversation = conversationHistory[currentConversationIndex]

  // State for user input
  const [input, setInput] = useState("")

  // State for chatbot visibility
  const [isOpen, setIsOpen] = useState(false)

  // State for showing/hiding categories
  const [showCategories, setShowCategories] = useState(false)

  // State for typing indicator
  const [isTyping, setIsTyping] = useState(false)

  // Ref for message container to auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentConversation.messages, isTyping])

  // Handle sending a message
  const handleSendMessage = (text: string = input, skipUserMessage = false) => {
    if (!text.trim() && !skipUserMessage) return

    const newMessages = [...currentConversation.messages]

    // Add user message if not skipping
    if (!skipUserMessage) {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        text: text,
        isUser: true,
        timestamp: new Date(),
      }

      newMessages.push(userMessage)
      setInput("")
    }

    // Update conversation
    const updatedConversation = {
      ...currentConversation,
      messages: newMessages,
    }

    const newHistory = [...conversationHistory]
    newHistory[currentConversationIndex] = updatedConversation
    setConversationHistory(newHistory)

    // Show typing indicator
    setIsTyping(true)

    // Process the message and respond
    setTimeout(() => {
      setIsTyping(false)

      if (text === "Browse by category") {
        handleBrowseCategories()
        return
      }

      // Check if it's a category selection
      const category = categories.find((cat) => cat.name === text)
      if (category) {
        handleCategorySelect(category.id)
        return
      }

      // Check if it's a direct question from a category
      for (const [catId, questions] of Object.entries(questionsByCategory)) {
        if (questions.includes(text)) {
          handleDirectQuestion(text)
          return
        }
      }

      // Otherwise, try to find an answer in FAQ data
      handleDirectQuestion(text)
    }, 1000) // Typing delay
  }

  // Handle browsing by category
  const handleBrowseCategories = () => {
    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      text: "Please select a category to browse:",
      isUser: false,
      timestamp: new Date(),
      options: categories.map((cat) => cat.name),
    }

    const newMessages = [...currentConversation.messages, botMessage]

    const updatedConversation = {
      ...currentConversation,
      messages: newMessages,
    }

    const newHistory = [...conversationHistory]
    newHistory[currentConversationIndex] = updatedConversation
    setConversationHistory(newHistory)

    setShowCategories(true)
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    const questions = questionsByCategory[categoryId as keyof typeof questionsByCategory] || []

    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      text: `Here are some common questions about ${categories.find((c) => c.id === categoryId)?.name}:`,
      isUser: false,
      timestamp: new Date(),
      options: questions,
      category: categoryId,
    }

    const newMessages = [...currentConversation.messages, botMessage]

    const updatedConversation = {
      ...currentConversation,
      messages: newMessages,
    }

    const newHistory = [...conversationHistory]
    newHistory[currentConversationIndex] = updatedConversation
    setConversationHistory(newHistory)

    setShowCategories(false)
  }

  // Handle direct question
  const handleDirectQuestion = (text: string) => {
    // Find best match in FAQ data
    let bestMatch = faqData[0]
    let highestScore = 0

    for (const faq of faqData) {
      // Simple matching algorithm - count matching words
      const questionWords = faq.question.toLowerCase().split(/\s+/)
      const inputWords = text.toLowerCase().split(/\s+/)

      let matchScore = 0
      for (const word of inputWords) {
        if (word.length > 2 && questionWords.includes(word)) {
          matchScore++
        }
      }

      // Exact match gets highest priority
      if (faq.question.toLowerCase() === text.toLowerCase()) {
        bestMatch = faq
        break
      }

      // Otherwise use the best match
      if (matchScore > highestScore) {
        highestScore = matchScore
        bestMatch = faq
      }
    }

    // If no good match found (threshold of 1 matching word)
    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      text:
        highestScore > 0
          ? bestMatch.answer
          : "I'm sorry, I don't have information on that specific question. Please contact our church office at +234 123 456 7890 for more assistance.",
      isUser: false,
      timestamp: new Date(),
      options: ["Ask another question", "Browse by category"],
    }

    const newMessages = [...currentConversation.messages, botMessage]

    const updatedConversation = {
      ...currentConversation,
      messages: newMessages,
    }

    const newHistory = [...conversationHistory]
    newHistory[currentConversationIndex] = updatedConversation
    setConversationHistory(newHistory)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage()
  }

  // Handle clicking an option
  const handleOptionClick = (option: string) => {
    handleSendMessage(option)
  }

  // Toggle chatbot visibility
  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  // Go back to previous conversation state
  const handleBack = () => {
    if (currentConversationIndex > 0) {
      setCurrentConversationIndex(currentConversationIndex - 1)
    } else if (currentConversation.messages.length > 1) {
      // Remove the last two messages (user question and bot response)
      const newMessages = currentConversation.messages.slice(0, -2)

      const updatedConversation = {
        ...currentConversation,
        messages: newMessages,
      }

      const newHistory = [...conversationHistory]
      newHistory[currentConversationIndex] = updatedConversation
      setConversationHistory(newHistory)
    }
  }

  // Reset conversation
  const handleReset = () => {
    setConversationHistory([
      {
        messages: [
          {
            id: "welcome",
            text: "Hello! I'm EMERGING AI, your virtual assistant for RCCG Halleluyah House. How can I help you today?",
            isUser: false,
            timestamp: new Date(),
            options: ["Browse by category", "Ask a question"],
          },
        ],
        currentIndex: 0,
      },
    ])
    setCurrentConversationIndex(0)
    setInput("")
    setShowCategories(false)
  }

  // Check if we can go back
  const canGoBack = currentConversationIndex > 0 || currentConversation.messages.length > 1

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <Button
        onClick={toggleChat}
        className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-primary hover:bg-primary/90"
        aria-label={isOpen ? "Close EMERGING AI" : "Open EMERGING AI"}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </Button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[550px] bg-background border border-border rounded-lg shadow-xl flex flex-col overflow-hidden"
          >
            {/* Chat header */}
            <div className="p-4 border-b border-border bg-primary text-primary-foreground flex justify-between items-center">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                <h3 className="font-bold">EMERGING AI</h3>
              </div>
              <div className="flex items-center space-x-2">
                {canGoBack && (
                  <button
                    onClick={handleBack}
                    className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Close EMERGING AI"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentConversation.messages.map((message) => (
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

                    {/* Options buttons */}
                    {message.options && message.options.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            className="w-full text-left p-2 text-xs bg-background hover:bg-muted rounded-md transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Category buttons */}
                    {showCategories &&
                      message.id === currentConversation.messages[currentConversation.messages.length - 1].id && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => handleOptionClick(category.name)}
                              className="text-left p-2 text-xs bg-background hover:bg-muted rounded-md transition-colors flex items-center"
                            >
                              <span className="mr-1">{category.icon}</span>
                              <span>{category.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted rounded-bl-none">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
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
              <div className="mt-2 text-xs text-center text-muted-foreground">
                Powered by EMERGING AI - The Emerging Generation
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

