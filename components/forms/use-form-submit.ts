"use client";

import { useRef, useState } from "react";

export type FormKind = "contact" | "prayer" | "testimony" | "salvation";

export interface SubmitPayload {
  kind: FormKind;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  category?: string;
  visibility?: string;
  message: string;
  /** Honeypot — always empty for real people. */
  website?: string;
  /** reCAPTCHA v2 response token — set by useCaptchaGatedSubmit, not by hand. */
  captchaToken?: string;
}

/**
 * Posts a form to /api/forms, which emails it to the church inbox.
 * Shared by the contact, prayer request, and testimony forms so they all
 * behave the same: submitting → success confirmation.
 *
 * The confirmation persists by default — someone submitting a prayer request
 * should not watch it vanish mid-read. Pass a millisecond value to auto-reset.
 */
export function useFormSubmit(resetAfterMs = 0) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: SubmitPayload): Promise<boolean> {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return false;
      }

      setIsSubmitted(true);
      if (resetAfterMs > 0) setTimeout(() => setIsSubmitted(false), resetAfterMs);
      return true;
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, isSubmitted, error };
}

/**
 * Wraps useFormSubmit with a reCAPTCHA checkbox step, ported from the church's
 * former site: submitting opens the checkbox modal, and only a verified token
 * triggers the actual POST. If NEXT_PUBLIC_RECAPTCHA_SITE_KEY isn't set, the
 * modal is skipped entirely and the payload submits straight away — so local
 * dev and a not-yet-configured deploy both keep working.
 *
 * Usage: call `requestSubmit(payload)` from the form's onSubmit, and render
 * <CaptchaModal open={showCaptcha} onVerify={handleCaptchaVerified} onClose={closeCaptcha} />
 * once, near the bottom of the page.
 */
export function useCaptchaGatedSubmit(resetAfterMs = 0) {
  const { submit, isSubmitting, isSubmitted, error } = useFormSubmit(resetAfterMs);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const pendingPayload = useRef<SubmitPayload | null>(null);

  function requestSubmit(payload: SubmitPayload) {
    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      submit(payload);
      return;
    }
    pendingPayload.current = payload;
    setShowCaptcha(true);
  }

  function handleCaptchaVerified(token: string) {
    setShowCaptcha(false);
    const payload = pendingPayload.current;
    pendingPayload.current = null;
    if (payload) submit({ ...payload, captchaToken: token });
  }

  function closeCaptcha() {
    setShowCaptcha(false);
    pendingPayload.current = null;
  }

  return { requestSubmit, showCaptcha, handleCaptchaVerified, closeCaptcha, isSubmitting, isSubmitted, error };
}
