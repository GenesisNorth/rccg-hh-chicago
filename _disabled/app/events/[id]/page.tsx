"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { canManageContent } from "@/lib/roles";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  UserX,
  Share2,
  ArrowLeft,
  Edit,
  CalendarPlus,
  Loader2,
  Ticket,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import dynamic from "next/dynamic";
import { UIEvent, isRegistrationOpen, isUpcoming } from "@/lib/event-types";

// react-paystack touches `window` at module load — load it client-only so it
// never evaluates during server rendering (that was crashing the detail page).
const PaystackButton = dynamic(
  () => import("react-paystack").then((m) => m.PaystackButton),
  { ssr: false }
);

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<UIEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const eventId = params.id as string;

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (res.status === 404) {
        toast({ title: "Event Not Found", description: "This event doesn't exist.", variant: "destructive" });
        router.push("/events");
        return;
      }
      if (!res.ok) throw new Error("load failed");
      setEvent(await res.json());
    } catch (error) {
      console.error("Error fetching event:", error);
      toast({ title: "Error", description: "Failed to load event details", variant: "destructive" });
      router.push("/events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const requireAuth = () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to register." });
      router.push(`/auth/signin?redirect=/events/${eventId}`);
      return false;
    }
    return true;
  };

  const handleFreeRegister = async () => {
    if (!requireAuth()) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Registration failed");
      }
      toast({ title: "You're in! 🎉", description: "Successfully registered for this event." });
      await fetchEvent();
    } catch (error) {
      toast({
        title: "Couldn't register",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/unregister`, { method: "DELETE" });
      if (!res.ok) throw new Error("Unregister failed");
      toast({ title: "Registration cancelled", description: "You've been removed from this event." });
      await fetchEvent();
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel registration", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaidSuccess = async (reference: any) => {
    setActionLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` },
        body: JSON.stringify({ paymentRef: reference.reference }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Registration failed");
      }
      toast({ title: "You're in! 🎉", description: "Payment received and registration confirmed." });
      await fetchEvent();
    } catch (error) {
      toast({
        title: "Payment received, registration issue",
        description: error instanceof Error ? error.message : "Please contact the church office.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: event?.title, text: event?.description, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Event link copied to clipboard." });
    }
  };

  // Downloads a .ics file so the event drops straight into Apple/Google Calendar
  const handleAddToCalendar = () => {
    if (!event) return;
    const fmt = (iso: string) => format(new Date(iso), "yyyyMMdd'T'HHmmss");
    const end = event.endDate || event.startDate;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//RCCG Halleluyah House//Events//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@halleluyahhouse`,
      `DTSTAMP:${fmt(new Date().toISOString())}`,
      `DTSTART:${fmt(event.startDate)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${(event.description || "").replace(/\n/g, "\\n")}`,
      `LOCATION:${event.location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) return null;

  const start = new Date(event.startDate);
  const isFree = !event.price || event.price <= 0;
  const canEdit = user && canManageContent(user.role);
  const regOpen = isRegistrationOpen(event);
  const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pb-16">
      {/* Hero */}
      <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden md:h-[52vh]">
        {event.image ? (
          <Image src={event.image} alt={event.title} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/30 via-primary/10 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-10">
          <div className="container flex items-center justify-between py-5">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => router.push("/events")}
              className="rounded-full bg-white/85 shadow-lg backdrop-blur-md hover:bg-card dark:bg-black/50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleShare}
                className="rounded-full bg-white/85 shadow-lg backdrop-blur-md hover:bg-card dark:bg-black/50"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              {canEdit && (
                <Button
                  variant="secondary"
                  size="icon"
                  asChild
                  className="rounded-full bg-white/85 shadow-lg backdrop-blur-md hover:bg-card dark:bg-black/50"
                >
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="container pb-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                {!isUpcoming(event) && <Badge className="bg-white/20 text-white backdrop-blur-md">Past event</Badge>}
                {event.status === "CANCELLED" && <Badge variant="destructive">Cancelled</Badge>}
                {event.tags?.slice(0, 3).map((t) => (
                  <Badge key={t} className="bg-white/20 text-white backdrop-blur-md hover:bg-white/30">
                    {t}
                  </Badge>
                ))}
              </div>
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white drop-shadow-sm md:text-5xl">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/90">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {format(start, "EEEE, MMMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {format(start, "h:mm a")}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {event.location}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container -mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-3xl border border-black/5 bg-card p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 md:p-8">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">About this event</h2>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{event.description}</p>
          </section>

          {/* Detail chips */}
          <section className="grid gap-4 sm:grid-cols-2">
            <DetailTile icon={<Calendar className="h-5 w-5" />} label="Date">
              {format(start, "EEE, MMM d, yyyy")}
            </DetailTile>
            <DetailTile icon={<Clock className="h-5 w-5" />} label="Time">
              {format(start, "h:mm a")}
              {event.endDate && ` – ${format(new Date(event.endDate), "h:mm a")}`}
            </DetailTile>
            <DetailTile icon={<MapPin className="h-5 w-5" />} label="Location">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {event.location}
              </a>
            </DetailTile>
            <DetailTile icon={<Ticket className="h-5 w-5" />} label="Admission">
              {isFree ? "Free" : `₦${event.price!.toLocaleString()}`}
            </DetailTile>
          </section>
        </div>

        {/* Sticky registration card */}
        <div className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-6">
            <div className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/90">
              {/* Attendance */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    {isFree ? "Free" : `₦${event.price!.toLocaleString()}`}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {event.currentAttendees} going
                    {event.spotsRemaining !== null && ` · ${event.spotsRemaining} left`}
                  </p>
                </div>
                {event.isRegistered && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Going
                  </span>
                )}
              </div>

              {/* Primary action */}
              {event.isRegistered ? (
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full"
                  onClick={handleUnregister}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserX className="mr-2 h-4 w-4" />}
                  Cancel registration
                </Button>
              ) : !regOpen ? (
                <Button disabled className="h-12 w-full rounded-full">
                  {event.status === "CANCELLED"
                    ? "Event cancelled"
                    : !isUpcoming(event)
                    ? "Event ended"
                    : event.spotsRemaining === 0
                    ? "Fully booked"
                    : "Registration closed"}
                </Button>
              ) : isFree ? (
                <Button
                  className="h-12 w-full rounded-full text-base shadow-sm"
                  onClick={handleFreeRegister}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                  Register
                </Button>
              ) : !user ? (
                <Button className="h-12 w-full rounded-full text-base" onClick={requireAuth}>
                  Sign in to register
                </Button>
              ) : paystackKey ? (
                <PaystackButton
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  email={user.email || ""}
                  amount={event.price! * 100}
                  publicKey={paystackKey}
                  text={`Pay ₦${event.price!.toLocaleString()} & Register`}
                  metadata={{
                    custom_fields: [
                      { display_name: "Event", variable_name: "event_title", value: event.title },
                      { display_name: "Event ID", variable_name: "event_id", value: event.id },
                    ],
                  }}
                  onSuccess={handlePaidSuccess}
                  onClose={() => toast({ title: "Payment cancelled" })}
                />
              ) : (
                <Button disabled className="h-12 w-full rounded-full">
                  Payments unavailable
                </Button>
              )}

              {/* Secondary: add to calendar */}
              <Button
                variant="ghost"
                className="mt-2 h-11 w-full rounded-full text-muted-foreground"
                onClick={handleAddToCalendar}
              >
                <CalendarPlus className="mr-2 h-4 w-4" /> Add to calendar
              </Button>

              {event.registrationDeadline && isUpcoming(event) && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Registration closes {format(new Date(event.registrationDeadline), "MMM d, yyyy")}
                </p>
              )}
            </div>

            {/* Organizer */}
            <div className="rounded-3xl border border-black/5 bg-card p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Hosted by
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {(event.organizerName || "HH").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{event.organizerName || "Church Office"}</p>
                  <p className="text-sm text-muted-foreground">RCCG Halleluyah House</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailTile({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-medium">{children}</p>
      </div>
    </div>
  );
}
