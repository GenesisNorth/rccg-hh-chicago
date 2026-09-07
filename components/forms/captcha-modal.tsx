"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const SCRIPT_ID = "recaptcha-script";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          theme?: "light" | "dark";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

function loadRecaptchaScript(onReady: () => void) {
  if (window.grecaptcha) {
    onReady();
    return;
  }
  if (document.getElementById(SCRIPT_ID)) {
    window.onRecaptchaLoad = onReady;
    return;
  }
  window.onRecaptchaLoad = onReady;
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

/**
 * "I'm not a robot" checkbox, shown before a form actually submits.
 * Ported from the church's former site (churchsite-rccg) — same reCAPTCHA
 * site registration, so the same site key works here.
 *
 * If NEXT_PUBLIC_RECAPTCHA_SITE_KEY isn't set, callers should skip this
 * modal entirely and submit directly — see useCaptchaGatedSubmit.
 */
export function CaptchaModal({
  open,
  onVerify,
  onClose,
}: {
  open: boolean;
  onVerify: (token: string) => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !SITE_KEY) return;
    loadRecaptchaScript(() => {
      if (containerRef.current && widgetId.current === null && window.grecaptcha) {
        widgetId.current = window.grecaptcha.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: resolvedTheme === "dark" ? "dark" : "light",
          callback: onVerify,
          "expired-callback": () => window.grecaptcha?.reset(widgetId.current ?? undefined),
        });
      } else if (widgetId.current !== null) {
        window.grecaptcha?.reset(widgetId.current);
      }
    });
  }, [open, resolvedTheme, onVerify]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={16} />
            </button>

            <div className="mb-1 flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
              <h3 className="text-sm font-semibold text-foreground">Quick Security Check</h3>
            </div>
            <p className="mb-5 text-xs text-muted-foreground">
              Please confirm you&apos;re human to send this form.
            </p>

            {SITE_KEY ? (
              <div ref={containerRef} className="flex justify-center" />
            ) : (
              <p className="text-xs text-red-500">
                Security check isn&apos;t configured yet. Please contact the site owner.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
