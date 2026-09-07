"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Phone, Mail, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"
import { useCaptchaGatedSubmit } from "@/components/forms/use-form-submit"
import { CaptchaModal } from "@/components/forms/captcha-modal"

// Ported from the church's former site.
const SUBJECTS = [
  "General Enquiry",
  "Prayer Request",
  "Pastoral Care",
  "New Member Information",
  "Giving & Finance",
  "Event Information",
  "Other",
]

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
}

const inputCls =
  "w-full rounded-xl border border-border bg-muted px-4 py-3.5 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-[#16A34A]/50 focus:outline-none"
const labelCls = "mb-2 block text-xs uppercase tracking-widest text-muted-foreground"

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const { requestSubmit, showCaptcha, handleCaptchaVerified, closeCaptcha, isSubmitting, isSubmitted, error } =
    useCaptchaGatedSubmit()
  const { theme } = useTheme()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    requestSubmit({
      kind: "contact",
      ...form,
      name: `${form.firstName} ${form.lastName}`.trim(),
    })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-12 pt-8 text-center sm:px-6 md:pb-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[#16A34A]/8 blur-[100px] sm:h-[400px] sm:w-[700px]" />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mb-7 text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl"
        >
          We&apos;d Love to
          <br />
          <span className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] bg-clip-text text-transparent">
            Hear from You
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="relative z-10 mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground"
        >
          Whether you have a question, a need, or just want to connect — our doors and hearts are
          always open.
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="relative z-10 mx-auto mt-12 h-px max-w-5xl origin-center bg-gradient-to-r from-transparent via-[#16A34A]/40 to-transparent"
        />
      </section>

      {/* Split card: form + image */}
      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto grid max-w-6xl overflow-hidden rounded-[2.5rem] border border-border shadow-2xl lg:grid-cols-2"
        >
          {/* Left — form */}
          <div className="bg-card p-8 md:p-10">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full min-h-96 flex-col items-center justify-center py-16 text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/20">
                    <CheckCircle className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="mb-4 text-4xl font-bold text-foreground">Message Sent!</h2>
                  <p className="max-w-sm leading-relaxed text-muted-foreground">
                    Thank you for reaching out. Someone from our team will be in touch with you
                    soon.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <h2 className="mb-1 text-3xl font-bold text-foreground">Send a Message</h2>
                  <p className="mb-8 text-sm text-muted-foreground">
                    We respond as soon as possible.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Honeypot — hidden from people, filled by bots */}
                    <input
                      type="text"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>First Name *</label>
                        <input
                          required
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Last Name *</label>
                        <input
                          required
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Email *</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="(xxx) xxx-xxxx"
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Subject *</label>
                      <select
                        required
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={inputCls}
                      >
                        <option value="">Select a topic…</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Message *</label>
                      <textarea
                        required
                        rows={5}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111827] py-4 font-bold text-white shadow-xl transition-all hover:bg-[#16A34A] disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Sending…
                        </span>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4" /> Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — image panel */}
          <div className="relative hidden min-h-[560px] lg:block">
            <img
              src="/images/preacher-podium.jpeg"
              alt="RCCG Halleluyah House"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute bottom-7 left-6 right-6"
            >
              <div className="rounded-2xl border border-white/15 bg-black/40 p-4 shadow-xl backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#16A34A]/40 bg-[#16A34A]/30">
                    <MapPin className="h-4 w-4 text-green-200" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">RCCG Halleluyah House</p>
                    <p className="mt-0.5 text-xs text-gray-300">888 E. Belvidere Rd, Suite 403</p>
                    <p className="text-xs text-gray-300">Grayslake, IL 60030</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute right-6 top-7 max-w-[200px]"
            >
              <div className="rounded-2xl border border-white/15 bg-black/40 p-4 shadow-xl backdrop-blur-xl">
                <p className="text-xs italic leading-relaxed text-white/80">
                  &ldquo;My house shall be called a house of prayer.&rdquo;
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-green-300">
                  Isaiah 56:7
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Info cards */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-3">
          {[
            {
              icon: MapPin,
              label: "Address",
              content: (
                <>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    888 E. Belvidere Rd, Suite 403
                    <br />
                    Grayslake, IL 60030
                  </p>
                  <a
                    href="https://maps.google.com/?q=888+E+Belvidere+Rd+Suite+403+Grayslake+IL+60030"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#16A34A] transition-colors hover:text-[#15803D]"
                  >
                    Open in Maps <ArrowRight className="h-3 w-3" />
                  </a>
                </>
              ),
            },
            {
              icon: Phone,
              label: "Phone",
              content: (
                <a
                  href="tel:8478109094"
                  className="text-sm text-muted-foreground transition-colors hover:text-[#16A34A]"
                >
                  847 810 9094
                </a>
              ),
            },
            {
              icon: Mail,
              label: "Email",
              content: (
                <a
                  href="mailto:info@rccghalleluyahhouse.org"
                  className="break-all text-sm text-muted-foreground transition-colors hover:text-[#16A34A]"
                >
                  info@rccghalleluyahhouse.org
                </a>
              ),
            },
          ].map(({ icon: Icon, label, content }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex h-full items-start gap-4 rounded-2xl border border-border bg-muted/40 p-5 transition-all duration-300 hover:border-[#16A34A]/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16A34A]/15">
                <Icon className="h-4 w-4 text-[#16A34A]" />
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
                {content}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="px-4 pb-12 sm:px-6 md:pb-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border shadow-2xl"
        >
          <iframe
            title="RCCG Halleluyah House Location"
            width="100%"
            height="320"
            style={{ border: 0, filter: theme === "dark" ? "invert(90%) hue-rotate(180deg) saturate(0.7)" : "none" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=888+E+Belvidere+Rd+Suite+403+Grayslake+IL+60030&output=embed&z=15"
          />
        </motion.div>
      </section>

      <CaptchaModal open={showCaptcha} onVerify={handleCaptchaVerified} onClose={closeCaptcha} />
    </main>
  )
}
