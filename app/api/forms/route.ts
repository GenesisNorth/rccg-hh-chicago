import { NextResponse } from "next/server";
import { sendEmail, createSubmissionHtml, FORM_RECIPIENT } from "@/lib/mail";
import { verifyCaptcha } from "@/lib/captcha";

/**
 * The site's only backend: every public form posts here and is emailed to the
 * church inbox. No database, no auth, no third-party state.
 *
 * NOTE: this endpoint must never be used to collect card or bank details.
 * Email is not an encrypted channel and storing card data this way is a PCI
 * violation — online giving goes through Tithe.ly, which handles payment data.
 */

export const runtime = "nodejs";

type FormKind = "contact" | "prayer" | "testimony" | "salvation";

const FORM_CONFIG: Record<FormKind, { heading: string; subject: (name: string) => string }> = {
  contact: {
    heading: "New Contact Message",
    subject: (name) => `Website contact — ${name}`,
  },
  prayer: {
    heading: "New Prayer Request",
    subject: (name) => `Prayer request — ${name}`,
  },
  testimony: {
    heading: "New Testimony",
    subject: (name) => `Testimony — ${name}`,
  },
  salvation: {
    heading: "New Salvation Decision 🎉",
    subject: (name) => `New salvation decision — ${name}`,
  },
};

// A salvation submission is worth capturing even with just a name and email —
// don't make someone who just prayed the prayer type out a message to be counted.
const MESSAGE_OPTIONAL: FormKind[] = ["salvation"];

const MAX_FIELD_LENGTH = 5000;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields, humans never see them. Accept silently
  // so the bot doesn't learn it was caught, but send nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const kind = String(body.kind || "contact") as FormKind;
  if (!FORM_CONFIG[kind]) {
    return NextResponse.json({ error: "Unknown form type." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (!name || (!message && !MESSAGE_OPTIONAL.includes(kind))) {
    return NextResponse.json({ error: "Please include your name and a message." }, { status: 400 });
  }
  if (email && !isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (name.length > 200 || message.length > MAX_FIELD_LENGTH) {
    return NextResponse.json({ error: "That submission is too long." }, { status: 400 });
  }

  const captchaOk = await verifyCaptcha(body.captchaToken);
  if (!captchaOk) {
    return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 });
  }

  const config = FORM_CONFIG[kind];
  const html = createSubmissionHtml(config.heading, {
    Name: name,
    Email: email,
    Phone: String(body.phone || "").trim(),
    Subject: String(body.subject || "").trim(),
    Category: String(body.category || "").trim(),
    Visibility: String(body.visibility || "").trim(),
    Message: message,
  });

  try {
    const result = await sendEmail({
      to: FORM_RECIPIENT,
      subject: config.subject(name),
      html,
      replyTo: email || undefined,
    });

    // delivered:false means no mail transport is configured. The visitor still
    // gets a success state; the server log carries the submission.
    return NextResponse.json({ ok: true, delivered: result.delivered });
  } catch (error) {
    console.error("[forms] send failed:", error);
    return NextResponse.json(
      { error: "We couldn't send that right now. Please try again or email us directly." },
      { status: 502 }
    );
  }
}
