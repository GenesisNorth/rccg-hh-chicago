import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "__session";

/**
 * Route protection via the Firebase session cookie set by /api/auth/session.
 *
 * NOTE: Edge middleware cannot run firebase-admin, so this checks cookie
 * *presence* and redirects — fast UX gating, not cryptographic proof.
 * Real enforcement lives in Firestore security rules and in API routes,
 * which verify the session cookie with the Admin SDK (FIX_TRACKER.md Phase 5).
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  const isAuthPage =
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signup") ||
    pathname.startsWith("/auth/login");

  // Signed-in users don't need the sign-in/sign-up pages
  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Everything matched below (except auth pages) requires a session
  if (!isAuthPage && !hasSession) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/messages/:path*",
    "/users/:path*",
    "/auth/signin",
    "/auth/signup",
    "/auth/login",
  ],
};
