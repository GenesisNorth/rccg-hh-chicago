/**
 * reCAPTCHA v2 ("I'm not a robot" checkbox) verification, ported from the
 * church's former site (churchsite-rccg) alongside the same site registration.
 *
 * If RECAPTCHA_SECRET_KEY isn't set, verification is skipped rather than
 * blocking every submission — lets local dev and a not-yet-configured deploy
 * keep working. Once the key is set, a missing or invalid token is rejected.
 */
export async function verifyCaptcha(token: unknown): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("[captcha] RECAPTCHA_SECRET_KEY is not set; skipping verification");
    return true;
  }
  if (!token || typeof token !== "string") return false;

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const result = await res.json();
  return result.success === true;
}
