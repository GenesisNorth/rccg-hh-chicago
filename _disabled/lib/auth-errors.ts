/**
 * Maps Firebase Auth error codes to human-friendly messages.
 * Never surface raw `error.message` (e.g. "Firebase: Error (auth/wrong-password)")
 * to users — it's ugly and leaks implementation details.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/wrong-password": "Incorrect email or password. Please try again.",
  "auth/user-not-found": "Incorrect email or password. Please try again.",
  "auth/invalid-email": "That email address doesn't look right. Please check and try again.",
  "auth/user-disabled": "This account has been disabled. Please contact the church office.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/email-already-in-use": "An account with this email already exists. Try signing in instead.",
  "auth/weak-password": "Password is too weak — use at least 6 characters.",
  "auth/network-request-failed": "Network problem. Please check your connection and try again.",
  "auth/popup-closed-by-user": "The sign-in window was closed before finishing. Please try again.",
  "auth/cancelled-popup-request": "The sign-in window was closed before finishing. Please try again.",
  "auth/popup-blocked": "Your browser blocked the sign-in window. Allow popups and try again.",
  "auth/requires-recent-login": "For security, please sign in again before making this change.",
  "auth/expired-action-code": "This link has expired. Please request a new one.",
  "auth/invalid-action-code": "This link is invalid or has already been used. Please request a new one.",
};

export function friendlyAuthError(error: unknown, fallback = "Something went wrong. Please try again."): string {
  const code = (error as { code?: string })?.code;
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return fallback;
}
