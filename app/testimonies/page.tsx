"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Quote, Heart, ArrowRight, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCaptchaGatedSubmit } from "@/components/forms/use-form-submit";
import { CaptchaModal } from "@/components/forms/captcha-modal";

// Matches the categories used on the church's former site.
const CATEGORIES = [
  "Healing & Health",
  "Financial Breakthrough",
  "Answered Prayer",
  "Salvation",
  "Restoration of Marriage/Family",
  "Career & Business",
  "Protection & Deliverance",
  "Other",
];

const EMPTY_TESTIMONY = {
  name: "",
  email: "",
  category: CATEGORIES[0],
  message: "",
  sharePublicly: true,
  website: "",
};

const testimonies = [
  {
    name: "Abidemi Sharon",
    role: "Chorister",
    image: "/images/praise.jpeg",
    category: "Faith & Community",
    quote:
      "As I reflect on my years in this church, I am filled with gratitude for the community and faith that have shaped my life. I came here as a young seeker, lost and searching for purpose, and through the warmth of this congregation, I found not only my faith but a family.",
  },
  {
    name: "Sister Grace",
    role: "Women's Ministry",
    image: "/images/mother-child.jpeg",
    category: "Healing & Restoration",
    quote:
      "When I first walked through these doors I was broken. The love I received from this congregation put me back together. Today I lead the women's fellowship and I see God's hand in every life we touch.",
  },
  {
    name: "Bro. Chukwuemeka",
    role: "Prayer Team",
    image: "/images/purple-preacher.jpeg",
    category: "Prayer & Breakthrough",
    quote:
      "Prayer is the backbone of everything we do at Halleluyah House. Every breakthrough I have witnessed — personal, family, career — came through the altar of this church. I am grateful beyond words.",
  },
  {
    name: "Deacon Michael",
    role: "Outreach Coordinator",
    image: "/images/community-service.jpeg",
    category: "Outreach",
    quote:
      "Our outreach programs changed my perspective on what church means. It is not just Sunday service — it is touching lives seven days a week. RCCG Halleluyah House lives that out every day.",
  },
];

export default function TestimoniesPage() {
  const [active, setActive] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_TESTIMONY);
  const { requestSubmit, showCaptcha, handleCaptchaVerified, closeCaptcha, isSubmitting, isSubmitted, error } =
    useCaptchaGatedSubmit();

  const prev = () => setActive((i) => (i === 0 ? testimonies.length - 1 : i - 1));
  const next = () => setActive((i) => (i === testimonies.length - 1 ? 0 : i + 1));

  const t = testimonies[active];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    requestSubmit({
      kind: "testimony",
      ...form,
      visibility: form.sharePublicly ? "OK to share publicly" : "Keep private",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-950/10 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-3xl mx-auto"
        >
          <p className="text-purple-600 font-bold tracking-widest text-sm uppercase mb-4">
            Stories of God's Faithfulness
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.05]">
            Testimonies
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            God is still writing stories of redemption, healing, and transformation in our community. These are some of them.
          </p>
        </motion.div>
      </section>

      {/* Featured Testimony Carousel */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-24">
        <div className="relative bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="grid md:grid-cols-2 min-h-[480px]"
            >
              {/* Image side */}
              <div className="relative overflow-hidden rounded-t-[2.5rem] md:rounded-none md:rounded-l-[2.5rem]">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-purple-300 mb-1 block">
                      {t.category}
                    </span>
                    <p className="text-white font-bold text-xl">{t.name}</p>
                    <p className="text-white/70 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>

              {/* Quote side */}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <Quote className="h-10 w-10 text-purple-200 dark:text-purple-900 mb-6 flex-shrink-0" />
                <p className="text-xl leading-relaxed text-foreground font-medium italic mb-8">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className="p-3 rounded-full border border-border hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-1.5 flex-1 justify-center">
                    {testimonies.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === active ? "w-6 bg-purple-600" : "w-2 bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={next}
                    aria-label="Next"
                    className="p-3 rounded-full border border-border hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* All stories grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">More Stories</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonies.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => { setActive(i); window.scrollTo({ top: 400, behavior: "smooth" }); }}
              className="bg-card border border-border rounded-3xl p-6 cursor-pointer hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-800 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div>
                  <p className="font-bold text-foreground">{story.name}</p>
                  <p className="text-xs text-muted-foreground">{story.role}</p>
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{story.category}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic line-clamp-3">"{story.quote}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Share your story CTA */}
      <section className="bg-gradient-to-b from-muted/40 to-background py-10 md:py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <Heart className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-3xl font-extrabold text-foreground mb-3">Share Your Story</h3>
          <p className="text-muted-foreground mb-8">
            Has God done something amazing in your life? Your testimony could be the key that unlocks someone else's miracle.
          </p>
          {!showForm && (
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-10"
            >
              Share a Testimony <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="mx-auto mt-10 max-w-2xl overflow-hidden text-left"
            >
              <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-xl md:p-12">
                {isSubmitted ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="mb-3 text-2xl font-bold text-foreground">Thank You for Sharing!</h2>
                    <p className="max-w-md text-muted-foreground">
                      Your testimony has been received. It may be featured here, or shared with the
                      church, to encourage someone else's faith.
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="t-name">Your name *</Label>
                        <Input
                          id="t-name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Jane Doe"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="t-email">Email</Label>
                        <Input
                          id="t-email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="t-category">Category</Label>
                      <Select
                        value={form.category}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger id="t-category" className="h-12 rounded-xl">
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
                      <Label htmlFor="t-message">Your testimony *</Label>
                      <Textarea
                        id="t-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Tell us what God has done…"
                        className="rounded-xl"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="t-share"
                        checked={form.sharePublicly}
                        onCheckedChange={(checked) =>
                          setForm((prev) => ({ ...prev, sharePublicly: checked === true }))
                        }
                      />
                      <Label htmlFor="t-share" className="cursor-pointer text-sm font-normal text-muted-foreground">
                        It&apos;s okay to feature this testimony publicly on the website
                      </Label>
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-14 flex-1 rounded-full bg-purple-600 text-base font-bold text-white shadow-lg transition-all hover:bg-purple-700 disabled:opacity-60"
                      >
                        {isSubmitting ? "Sending…" : "Share My Testimony"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        className="h-14 rounded-full px-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <CaptchaModal open={showCaptcha} onVerify={handleCaptchaVerified} onClose={closeCaptcha} />
    </div>
  );
}
