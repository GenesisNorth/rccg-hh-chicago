import nodemailer from "nodemailer";
import { Resend } from "resend";

/**
 * Outbound mail for the site's contact / prayer / testimony forms.
 *
 * Two transports, tried in order:
 *   1. Resend  — set RESEND_API_KEY (recommended; no SMTP server to babysit)
 *   2. SMTP    — set SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD
 *                (works with a Gmail App Password: smtp.gmail.com : 587)
 *
 * If neither is configured the send is skipped and logged, so local dev
 * never fails just because mail credentials are missing.
 */

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

const smtpTransport = hasSmtp
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASSWORD as string,
      },
    })
  : null;

/** Where every form submission lands. */
export const FORM_RECIPIENT = process.env.CHURCH_INBOX_EMAIL || "lightseedfellows@gmail.com";

export interface SendEmailArgs {
  to?: string;
  subject: string;
  html: string;
  /** Set to the visitor's address so a reply in the inbox goes straight to them. */
  replyTo?: string;
}

export type SendResult = { delivered: boolean; transport: "resend" | "smtp" | "none" };

export async function sendEmail({ to, subject, html, replyTo }: SendEmailArgs): Promise<SendResult> {
  const recipient = to || FORM_RECIPIENT;
  const from = process.env.EMAIL_FROM || "RCCG Halleluyah House <onboarding@resend.dev>";

  if (resend) {
    const { error } = await resend.emails.send({
      from,
      to: recipient,
      subject,
      html,
      replyTo: replyTo,
    });
    if (error) throw new Error(error.message);
    return { delivered: true, transport: "resend" };
  }

  if (smtpTransport) {
    await smtpTransport.sendMail({ from, to: recipient, subject, html, replyTo });
    return { delivered: true, transport: "smtp" };
  }

  console.warn(
    `[mail] No RESEND_API_KEY or SMTP_* configured — submission not emailed.\n` +
      `       To: ${recipient}\n       Subject: ${subject}`
  );
  return { delivered: false, transport: "none" };
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Renders a submission as a plain, readable table. Every value is escaped —
 * the fields come straight from a public form, so they are never trusted markup.
 */
export function createSubmissionHtml(heading: string, fields: Record<string, string | undefined>) {
  const rows = Object.entries(fields)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #eee;font-weight:600;color:#444;white-space:nowrap;vertical-align:top;">${escapeHtml(
          label
        )}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#111;white-space:pre-wrap;">${escapeHtml(
          value as string
        )}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;">
    <h2 style="margin:0 0 4px;color:#111;">${escapeHtml(heading)}</h2>
    <p style="margin:0 0 20px;color:#666;font-size:14px;">
      Submitted from the RCCG Halleluyah House website on ${new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago",
        dateStyle: "full",
        timeStyle: "short",
      })} (Central).
    </p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;">
      ${rows}
    </table>
  </div>`;
}
