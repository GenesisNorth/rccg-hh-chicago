"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Briefcase, Home, BookOpen, X, Heart, ArrowRight } from "lucide-react"

const involvementOptions = [
  {
    id: "member",
    title: "Becoming a Member",
    description: "We warmly invite you to become a member of our church community. By joining us, you'll not only find spiritual growth and support but also a vibrant community of caring individuals who share in faith and fellowship.",
    ctaText: "Yes, I want to be a member",
    icon: Users,
    gradient: "from-blue-500 to-indigo-600",
    accentColor: "#3b82f6",
    image: "/images/celebration.jpeg",
    formFields: [
      { id: "name", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: true },
      { id: "address", label: "Home Address", type: "text", required: true },
      { id: "previousChurch", label: "Previous Church (if any)", type: "text", required: false },
    ],
  },
  {
    id: "workforce",
    title: "Joining the Workforce",
    description: "Use your gifts and talents to serve the body of Christ. Whether in music, media, ushering, children's church or any other department — there's a place for you in our ministry workforce.",
    ctaText: "I want to serve",
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-600",
    accentColor: "#10b981",
    image: "/images/keyboard-worship.jpeg",
    formFields: [
      { id: "name", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: true },
      {
        id: "department",
        label: "Preferred Department",
        type: "select",
        required: true,
        options: [
          "Choir",
          "Bereau of Information",
          "Children's Church",
          "Evangelism",
          "Media",
          "Ushering",
          "Protocol",
          "Technical",
          "Prayer",
          "Sanitation",
          "Research & Development",
          "Sunday School",
          "Finance",
          "Security",
          "Other",
        ],
      },
      { id: "experience", label: "Relevant Experience", type: "textarea", required: false },
    ],
  },
  {
    id: "believers",
    title: "Starting Believers' Class",
    description: "New to faith or looking to build a stronger foundation? Our Believers' Class is designed to help you understand who you are in Christ and what it means to live as a Christian.",
    ctaText: "Start my Believers' Class",
    icon: BookOpen,
    gradient: "from-amber-500 to-orange-500",
    accentColor: "#f59e0b",
    image: "/images/preaching.jpeg",
    formFields: [
      { id: "name", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: true },
      { id: "conversionDate", label: "Date of Salvation (if known)", type: "date", required: false },
      { id: "baptized", label: "Have you been baptized?", type: "checkbox", required: false },
    ],
  },
]

export default function GetInvolved() {
  const [openPopups, setOpenPopups] = useState<Record<string, boolean>>({})
  const [expandedItem, setExpandedItem] = useState<string>("member")
  const [submittedForms, setSubmittedForms] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<Record<string, Record<string, any>>>({
    member: {},
    workforce: {},
    believers: {},
  })

  const activeOption = involvementOptions.find((o) => o.id === expandedItem)

  useEffect(() => {
    const hasOpenPopup = Object.values(openPopups).some((isOpen) => isOpen)
    if (hasOpenPopup) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
      if (scrollY) window.scrollTo(0, parseInt(scrollY || "0", 10) * -1)
    }
    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
    }
  }, [openPopups])

  const togglePopup = (id: string) => {
    setOpenPopups((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const closePopup = (id: string) => {
    setOpenPopups((prev) => ({ ...prev, [id]: false }))
  }

  const handleInputChange = (optionId: string, fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [optionId]: { ...prev[optionId], [fieldId]: value } }))
  }

  const handleSubmit = (optionId: string, e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedForms((prev) => ({ ...prev, [optionId]: true }))
    setTimeout(() => {
      closePopup(optionId)
      setFormData((prev) => ({ ...prev, [optionId]: {} }))
      setTimeout(() => setSubmittedForms((prev) => ({ ...prev, [optionId]: false })), 5000)
    }, 2000)
  }

  const renderFormField = (option: (typeof involvementOptions)[0], field: any) => {
    const optionId = option.id
    const fieldId = field.id
    const value = formData[optionId][fieldId] || ""
    const inputClass =
      "w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent focus:bg-card transition-all duration-200 placeholder:text-muted-foreground"

    if (field.type === "checkbox") {
      return (
        <div key={fieldId} className="flex items-center gap-3 py-1">
          <Checkbox
            id={`${optionId}-${fieldId}`}
            checked={value || false}
            onCheckedChange={(checked) => handleInputChange(optionId, fieldId, checked)}
            className="rounded-md"
          />
          <label htmlFor={`${optionId}-${fieldId}`} className="text-sm text-foreground cursor-pointer select-none">
            {field.label}
          </label>
        </div>
      )
    }

    return (
      <div key={fieldId} className="space-y-1.5">
        <label htmlFor={`${optionId}-${fieldId}`} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">
          {field.label}
          {field.required && <span className="text-red-400 ml-0.5 normal-case tracking-normal">*</span>}
        </label>
        {field.type === "textarea" ? (
          <Textarea
            id={`${optionId}-${fieldId}`}
            value={value}
            onChange={(e) => handleInputChange(optionId, fieldId, e.target.value)}
            required={field.required}
            className={`${inputClass} min-h-[90px] resize-none focus:ring-[${option.accentColor}]`}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        ) : field.type === "select" ? (
          <Select value={value} onValueChange={(val) => handleInputChange(optionId, fieldId, val)}>
            <SelectTrigger id={`${optionId}-${fieldId}`} className={inputClass}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt: string) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id={`${optionId}-${fieldId}`}
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(optionId, fieldId, e.target.value)}
            required={field.required}
            className={inputClass}
            placeholder={field.type === "date" ? undefined : `Enter ${field.label.toLowerCase()}...`}
          />
        )}
      </div>
    )
  }

  const renderPopup = (option: (typeof involvementOptions)[0]) => {
    if (!openPopups[option.id]) return null

    return (
      <motion.div
        key={option.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-black/65 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
        onClick={() => closePopup(option.id)}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ duration: 0.35, type: "spring", bounce: 0.25 }}
          className="bg-card rounded-3xl shadow-2xl w-full overflow-hidden flex flex-col md:flex-row max-w-2xl max-h-[92vh] md:max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <>
              {/* Left panel (hidden on mobile) */}
              <div className={`hidden md:flex md:w-[42%] flex-col bg-gradient-to-br ${option.gradient} p-7 flex-shrink-0`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-white/20">
                    <option.icon className="h-7 w-7 text-white" />
                  </div>
                  <button
                    onClick={() => closePopup(option.id)}
                    className="ml-auto p-2 rounded-full bg-white/10 hover:bg-white/25 transition-colors md:hidden"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-white leading-snug mb-3">{option.title}</h2>
                <p className="text-white/80 text-sm leading-relaxed flex-1">{option.description}</p>
                <div className="mt-6 rounded-2xl overflow-hidden h-44 flex-shrink-0">
                  <img
                    src={(option as any).image}
                    alt={option.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right panel – form */}
              <div className="flex flex-col flex-1 min-h-0">
                {/* Mobile header */}
                <div className={`md:hidden bg-gradient-to-r ${option.gradient} px-5 py-4 flex items-center justify-between flex-shrink-0`}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/20">
                      <option.icon className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-white">{option.title}</h2>
                  </div>
                  <button
                    onClick={() => closePopup(option.id)}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/30 transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Desktop close */}
                <div className="hidden md:flex justify-end px-6 pt-5 flex-shrink-0">
                  <button
                    onClick={() => closePopup(option.id)}
                    className="p-2 rounded-full bg-muted hover:bg-gray-200 transition-colors group"
                  >
                    <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </div>

                {/* Form scroll area */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 md:pt-2">
                  {submittedForms[option.id] ? (
                    <div className="flex items-center justify-center h-full min-h-[280px]">
                      <SuccessState message="We've received your details and will be in touch soon." />
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleSubmit(option.id, e)} className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground mb-1">Your details</h3>
                      <p className="text-xs text-muted-foreground mb-4">Fields marked <span className="text-red-400">*</span> are required.</p>

                      {option.formFields?.map((field) => renderFormField(option, field))}

                      <div className="pt-4">
                        <button
                          type="submit"
                          className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${option.gradient} text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg`}
                          style={{ boxShadow: `0 8px 24px -4px ${option.accentColor}50` }}
                        >
                          Submit Application
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="py-16 sm:py-24 bg-card relative overflow-hidden" id="get-involved">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Be a part of God&apos;s move by:
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Accordion list */}
          <div className="space-y-3">
            {involvementOptions.map((option, index) => {
              const isExpanded = expandedItem === option.id
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  {isExpanded ? (
                    <div className="border-2 border-primary/50 rounded-2xl p-5 bg-card shadow-sm">
                      <h3 className="text-xl font-bold text-foreground mb-3">{option.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-5">{option.description}</p>
                      <button
                        onClick={() => togglePopup(option.id)}
                        className="inline-flex items-center gap-2 bg-card border border-border hover:border-primary hover:bg-primary/5 text-foreground text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                      >
                        {(option as any).ctaText}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpandedItem(option.id)}
                      className="w-full text-left px-2 py-3.5 border-b border-border hover:border-muted-foreground transition-colors duration-200 group"
                    >
                      <span className="text-xl font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        {option.title}
                      </span>
                    </button>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Right: Dynamic image */}
          <div className="rounded-3xl overflow-hidden shadow-xl h-[420px] lg:h-full lg:min-h-[460px] relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={expandedItem}
                src={activeOption?.image ?? "/images/celebration.jpeg"}
                alt={activeOption?.title ?? ""}
                className="w-full h-full object-cover absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {involvementOptions.map((option) => renderPopup(option))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SuccessState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
        className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200"
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      <h3 className="text-xl font-bold text-foreground mb-2">You&apos;re all set!</h3>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{message}</p>
    </div>
  )
}
