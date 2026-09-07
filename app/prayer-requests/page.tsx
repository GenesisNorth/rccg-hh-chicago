"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HandHeart, Send, CheckCircle, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCaptchaGatedSubmit } from "@/components/forms/use-form-submit";
import { CaptchaModal } from "@/components/forms/captcha-modal";

// Matches the categories used on the church's former site, so pastoral
// follow-up stays consistent with what people are used to seeing.
const CATEGORIES = [
  "Healing & Health",
  "Family & Relationships",
  "Financial Breakthrough",
  "Career & Purpose",
  "Salvation of a Loved One",
  "Spiritual Growth",
  "Protection & Safety",
  "Marriage",
  "Other",
];

// Ported from the former site's "God's Promises About Prayer" section.
const PROMISES = [
  {
    verse: "Matthew 18:19",
    text: "If two of you agree on earth about anything they ask, it will be done for them by my Father in heaven.",
  },
  {
    verse: "Philippians 4:6–7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.",
  },
  {
    verse: "James 5:16",
    text: "The prayer of a righteous person is powerful and effective.",
  },
];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  category: "Healing & Health",
  visibility: "private",
  message: "",
  website: "",
};

export default function PrayerRequestsPage() {
  const [form, setForm] = useState(EMPTY);
  const { requestSubmit, showCaptcha, handleCaptchaVerified, closeCaptcha, isSubmitting, isSubmitted, error } =
    useCaptchaGatedSubmit();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestSubmit({
      kind: "prayer",
      ...form,
      visibility:
        form.visibility === "private"
          ? "Private — pastors only"
          : "May be shared with the prayer team",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-12 pt-8 sm:px-6 md:pb-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[#16A34A]/8 blur-[100px] sm:h-[400px] sm:w-[700px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#16A34A]"
          >
            We Pray Together
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl"
          >
            Submit a
            <br />
            <span className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] bg-clip-text text-transparent">
              Prayer Request
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground"
          >
            You are not alone. Our prayer team stands with you — bringing your needs before the
            throne of God with faith and fervency.
          </motion.p>
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="mx-auto mt-12 h-px max-w-5xl origin-center bg-gradient-to-r from-transparent via-[#16A34A]/40 to-transparent"
        />
      </section>

      {/* God's Promises About Prayer */}
      <section className="bg-muted/40 px-4 py-12 sm:px-6 md:py-14 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-10 text-center text-xs uppercase tracking-widest text-muted-foreground">
            God&apos;s Promises About Prayer
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {PROMISES.map((p, i) => (
              <motion.div
                key={p.verse}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-500 hover:border-[#16A34A]/30"
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#16A34A]">
                  {p.verse}
                </p>
                <p className="flex-1 text-lg leading-relaxed text-foreground">&ldquo;{p.text}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + image panel */}
      <section className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto grid max-w-6xl overflow-hidden rounded-[2.5rem] border border-border shadow-2xl lg:grid-cols-2"
        >
          {/* Left — form */}
          <div className="bg-card p-8 md:p-10">
            {isSubmitted ? (
              <div className="flex h-full min-h-96 flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-foreground">Request Received</h2>
                <p className="max-w-md text-muted-foreground">
                  Our prayer team has received your request and will begin interceding on your
                  behalf. Be encouraged — God hears every prayer (1 John 5:14).
                </p>
              </div>
            ) : (
              <>
                <h2 className="mb-1 text-2xl font-bold text-foreground">Your Prayer Request</h2>
                <p className="mb-8 text-sm text-muted-foreground">
                  All submissions are treated with confidentiality and care.
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
                    <div className="space-y-2">
                      <Label htmlFor="name">Your name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Jane Doe"
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="(847) 810 9094"
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Prayer category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger id="category" className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your prayer request *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Share what's on your heart. Our team will pray specifically for your need…"
                      className="rounded-xl"
                    />
                  </div>

                  <RadioGroup
                    value={form.visibility}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, visibility: value }))}
                  >
                    <label
                      htmlFor="private"
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:border-[#16A34A]/40"
                    >
                      <RadioGroupItem value="private" id="private" className="mt-0.5" />
                      <span className="text-sm leading-snug text-muted-foreground">
                        <span className="mb-1 flex items-center gap-1.5">
                          <Lock className="h-3 w-3 text-[#16A34A]" />
                          <strong className="text-foreground">Keep this request confidential</strong>
                        </span>
                        Only the pastoral team will see this request — it will not be shared
                        publicly.
                      </span>
                    </label>
                  </RadioGroup>

                  {error && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-14 w-full items-center justify-center rounded-full bg-[#111827] text-base font-bold text-white shadow-lg transition-all hover:bg-[#16A34A] disabled:opacity-60"
                  >
                    {isSubmitting ? "Submitting…" : "Submit Prayer Request"}
                    {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Your request is received with love. We are praying with you.
                  </p>
                </form>
              </>
            )}
          </div>

          {/* Right — image panel */}
          <div className="relative hidden min-h-[560px] lg:block">
            <img
              src="/images/praise.jpeg"
              alt="RCCG Halleluyah House prayer team"
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
                    <HandHeart className="h-4 w-4 text-green-200" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Our Prayer Team</p>
                    <p className="mt-0.5 text-xs text-gray-300">
                      We intercede for every request submitted — you are never praying alone.
                    </p>
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
                  &ldquo;Call to me and I will answer you and tell you great and unsearchable
                  things.&rdquo;
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-green-300">
                  Jeremiah 33:3
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Closing scripture */}
      <section className="border-t border-border bg-muted/40 px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-2xl leading-relaxed text-foreground md:text-3xl">
            &ldquo;Cast all your anxiety on him because he cares for you.&rdquo;
          </p>
          <span className="text-sm uppercase tracking-widest text-[#16A34A]">1 Peter 5:7</span>
        </motion.div>
      </section>

      <CaptchaModal open={showCaptcha} onVerify={handleCaptchaVerified} onClose={closeCaptcha} />
    </div>
  );
}
