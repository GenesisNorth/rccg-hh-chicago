import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const SESSION_COOKIE_NAME = "__session";
const SESSION_EXPIRES_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

/**
 * Exchanges a Firebase ID token for an HttpOnly session cookie.
 * Called by AuthContext right after Firebase sign-in so that
 * middleware and server routes can authenticate requests.
 */
export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();
        if (!idToken || typeof idToken !== "string") {
            return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
        }

        // Reject tokens older than 5 minutes — session creation should follow a fresh sign-in
        const decoded = await adminAuth.verifyIdToken(idToken);
        if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
            return NextResponse.json({ error: "Recent sign-in required" }, { status: 401 });
        }

        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn: SESSION_EXPIRES_MS,
        });

        const response = NextResponse.json({ status: "ok" });
        response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: SESSION_EXPIRES_MS / 1000,
            path: "/",
        });
        return response;
    } catch (error) {
        console.error("Error creating session cookie:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

/** Clears the session cookie on sign-out. */
export async function DELETE() {
    const response = NextResponse.json({ status: "ok" });
    response.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });
    return response;
}
