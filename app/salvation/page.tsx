"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCaptchaGatedSubmit } from "@/components/forms/use-form-submit";
import { CaptchaModal } from "@/components/forms/captcha-modal";

// The "Roman Road" — ported from the church's former site.
const STEPS = [
  {
    ref: "Romans 3:23",
    text: "All have sinned and fall short of the glory of God.",
  },
  {
    ref: "Romans 6:23",
    text: "The wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.",
  },
  {
    ref: "Romans 5:8",
    text: "God demonstrates His own love for us in this: While we were still sinners, Christ died for us.",
  },
  {
    ref: "Romans 10:9–10",
    text: `If you declare with your mouth "Jesus is Lord" and believe in your heart that God raised him from the dead, you will be saved.`,
  },
  {
    ref: "Romans 10:13",
    text: "Everyone who calls on the name of the Lord will be saved.",
  },
];

const prayer = `Heavenly Father, I come to You today as a sinner. I believe that Jesus Christ is Your Son, that He died on the cross for my sins, and that You raised Him from the dead. I repent of my sins and I turn away from my old life. Lord Jesus, come into my heart right now. Be my Lord and my Saviour. Fill me with Your Holy Spirit and help me to live for You from this day forward. Thank You for saving me. In Jesus' name, Amen.`;

const EMPTY_DECISION = { name: "", email: "", phone: "", message: "", website: "" };

export default function SalvationPage() {
  const [prayed, setPrayed] = useState(false);
  const [form, setForm] = useState(EMPTY_DECISION);
  const { requestSubmit, showCaptcha, handleCaptchaVerified, closeCaptcha, isSubmitting, isSubmitted, error } =
    useCaptchaGatedSubmit();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    requestSubmit({
      kind: "salvation",
      ...form,
      message: form.message || "Prayed the prayer of salvation on the website.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-12 pt-8 text-center sm:px-6 md:pb-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[#16A34A]/8 blur-[100px] sm:h-[400px] sm:w-[700px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto max-w-4xl"
        >
          <span className="mb-5 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#16A34A]">
            The Most Important Decision of Your Life
          </span>
          <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl">
            Give Your Life
            <br />
            <span className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] bg-clip-text text-transparent">
              to Christ
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
            God loves you unconditionally. No matter where you&apos;ve been, what you&apos;ve done,
            or how far you feel — Jesus is reaching out to you today. One prayer changes everything.
          </p>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mx-auto mt-12 h-px max-w-5xl origin-center bg-gradient-to-r from-transparent via-[#16A34A]/40 to-transparent"
        />
      </section>

      {/* The Roman Road */}
      <section className="bg-muted/40 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            What the Bible Says About Salvation
          </h2>
          <p className="mb-12 text-center text-sm text-muted-foreground">
            Known as the &ldquo;Roman Road&rdquo; — five scriptures that show you the way to God.
          </p>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.ref}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-[#16A34A]/30"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#16A34A]/30 bg-[#16A34A]/10">
                  <span className="text-xs font-bold text-[#16A34A]">{i + 1}</span>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#16A34A]">
                    {step.ref}
                  </p>
                  <p className="text-lg leading-relaxed text-foreground">&ldquo;{step.text}&rdquo;</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prayer of Salvation */}
      <section className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#16A34A]/25 bg-gradient-to-br from-[#16A34A]/8 via-card to-card p-8 md:p-12"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#16A34A]/10 blur-[80px]" />
          <div className="relative z-10 text-center">
            <h2 className="mb-6 text-3xl font-bold text-foreground">The Prayer of Salvation</h2>
            <p className="text-center text-base italic leading-[1.9] text-muted-foreground md:text-lg">
              {prayer}
            </p>

            <div className="mt-10">
              <AnimatePresence mode="wait">
                {!prayed ? (
                  <motion.button
                    key="pray"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setPrayed(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#16A34A]/20 transition-all hover:bg-[#15803D]"
                  >
                    <Heart className="h-4 w-4" /> I prayed this prayer
                  </motion.button>
                ) : (
                  <motion.div
                    key="celebrated"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/20">
                      <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="mb-3 text-3xl font-bold text-foreground">Welcome to the Family!</h3>
                    <p className="mx-auto max-w-md text-sm text-muted-foreground">
                      Heaven is rejoicing over you right now (Luke 15:7). Please fill in the form
                      below so our pastors can connect with you and help you take your next steps.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Follow-up form — only asked for after they've prayed */}
      {prayed && (
        <section className="px-4 pb-12 sm:px-6 md:pb-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto grid max-w-6xl overflow-hidden rounded-[2.5rem] border border-border shadow-2xl lg:grid-cols-2"
          >
            {/* Left — form */}
            <div className="bg-card p-8 md:p-10">
              {isSubmitted ? (
                <div className="flex h-full min-h-96 flex-col items-center justify-center py-12 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">We Received Your Decision!</h3>
                  <p className="max-w-md leading-relaxed text-muted-foreground">
                    A pastor from RCCG Halleluyah House will contact you soon. Your new life in
                    Christ begins today — you are loved, forgiven, and never alone.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  <h2 className="text-2xl font-bold text-foreground">Let Us Walk With You</h2>
                  <p className="text-sm text-muted-foreground">
                    One of our pastors will reach out to help you begin your new life in Christ.
                  </p>

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
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="h-12 rounded-xl"
                      />
                    </div>
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

                  <div className="space-y-2">
                    <Label htmlFor="message">Any questions or message?</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Feel free to share anything on your heart…"
                      className="rounded-xl"
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-14 w-full items-center justify-center rounded-full bg-[#16A34A] text-base font-bold text-white shadow-lg transition-all hover:bg-[#15803D] disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending…" : "Submit My Decision"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Your information is kept private and only shared with our pastoral team.
                  </p>
                </form>
              )}
            </div>

            {/* Right — image panel */}
            <div className="relative hidden min-h-[560px] lg:block">
              <img
                src="/images/worship.jpeg"
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
                      <Heart className="h-4 w-4 text-green-200" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">A New Life Begins Today</p>
                      <p className="mt-0.5 text-xs text-gray-300">
                        Heaven rejoices over every soul that returns to God.
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
                    &ldquo;Everyone who calls on the name of the Lord will be saved.&rdquo;
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-green-300">
                    Romans 10:13
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      )}

      <CaptchaModal open={showCaptcha} onVerify={handleCaptchaVerified} onClose={closeCaptcha} />
    </div>
  );
}
