import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "./firebase-admin";
import { UserRole } from "./firestore-types";
import {
  canAccessAdminPanel,
  canManageContent,
  canManageUsers,
  hasLeadershipRole,
  isSuperAdmin,
} from "./roles";

const SESSION_COOKIE_NAME = "__session";

export interface AuthenticatedUser {
  uid: string;
  email: string;
  name: string | null;
  role: UserRole;
}

/**
 * Verifies the HttpOnly session cookie (set by /api/auth/session) with the
 * Admin SDK and returns the caller + their Firestore role.
 * Returns null when unauthenticated — route handlers decide the response.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return null;

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const data = userDoc.data();

    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      name: (data?.name as string) ?? null,
      role: (data?.role as UserRole) ?? UserRole.MEMBER,
    };
  } catch (error) {
    // Expired/revoked/invalid cookie — treat as signed out
    return null;
  }
}

export const unauthorized = () =>
  NextResponse.json({ error: "Authentication required" }, { status: 401 });

export const forbidden = () =>
  NextResponse.json({ error: "You don't have permission to do this" }, { status: 403 });

// Role predicates re-exported so routes import everything from one place
export { canAccessAdminPanel, canManageContent, canManageUsers, hasLeadershipRole, isSuperAdmin };
