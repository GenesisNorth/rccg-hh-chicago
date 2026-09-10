"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Play, BookOpen, User, Headphones, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sermons, sermonSeries } from "@/content/sermons";
import { formatDate, sortKey } from "@/lib/dates";

export default function SermonsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return sermons
      .filter((s) => (selectedSeries === "all" ? true : s.series === selectedSeries))
      .filter((s) =>
        q
          ? s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            (s.preacher?.toLowerCase().includes(q) ?? false) ||
            (s.scripture?.toLowerCase().includes(q) ?? false)
          : true
      )
      .sort((a, b) => sortKey(b.date) - sortKey(a.date));
  }, [searchTerm, selectedSeries]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      <div className="border-b border-black/5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <BookOpen className="h-3.5 w-3.5" /> The Word
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Sermons</h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Catch up on messages from our services — listen again, or share one with someone who needs it.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Select value={selectedSeries} onValueChange={setSelectedSeries}>
            <SelectTrigger className="h-11 w-full rounded-full border-black/10 bg-card shadow-sm sm:w-56 dark:border-white/10">
              <SelectValue placeholder="All series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All series</SelectItem>
              {sermonSeries.map((series) => (
                <SelectItem key={series} value={series}>
                  {series}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sermons…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-full border-black/10 bg-card pl-10 shadow-sm dark:border-white/10 dark:bg-neutral-900"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-muted/30 py-16 text-center dark:border-white/10">
            <BookOpen className="mb-4 h-14 w-14 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold">No sermons found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try a different search term or series.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sermon, i) => (
              <motion.article
                key={sermon.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-card shadow-sm transition-shadow hover:shadow-lg dark:border-white/10"
              >
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  {sermon.thumbnail ? (
                    <Image
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {sermon.featured && (
                    <Badge className="absolute left-4 top-4 bg-[#16A34A] text-white hover:bg-[#16A34A]">
                      Latest
                    </Badge>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  {sermon.series && (
                    <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#16A34A]">
                      {sermon.series}
                    </span>
                  )}
                  <h2 className="mb-2 text-lg font-bold leading-snug text-foreground">{sermon.title}</h2>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {sermon.description}
                  </p>

                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    {sermon.preacher && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 shrink-0 text-[#16A34A]" />
                        <span>{sermon.preacher}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0 text-[#16A34A]" />
                      <span>{formatDate(sermon.date)}</span>
                    </div>
                    {sermon.scripture && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 shrink-0 text-[#16A34A]" />
                        <span>{sermon.scripture}</span>
                      </div>
                    )}
                  </div>

                  {(sermon.videoUrl || sermon.audioUrl) && (
                    <div className="mt-5 flex gap-3">
                      {sermon.videoUrl && (
                        <a
                          href={sermon.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#111827] text-sm font-semibold text-white transition-colors hover:bg-[#16A34A]"
                        >
                          <Play className="h-4 w-4" /> Watch
                        </a>
                      )}
                      {sermon.audioUrl && (
                        <a
                          href={sermon.audioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-black/10 text-sm font-semibold text-foreground transition-colors hover:bg-muted dark:border-white/10"
                        >
                          <Headphones className="h-4 w-4" /> Listen
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
