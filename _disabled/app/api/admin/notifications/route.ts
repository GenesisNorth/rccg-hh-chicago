import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser, unauthorized, forbidden, canAccessAdminPanel } from "@/lib/server-auth";
import { adminUserService, serialize } from "@/lib/admin-firestore";
import { parseBody, broadcastNotificationSchema } from "@/lib/validation";

/** Recently broadcast notifications (deduped by broadcastId). */
export async function GET() {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canAccessAdminPanel(caller.role)) return forbidden();

    try {
        const snap = await adminDb
            .collection("notifications")
            .orderBy("createdAt", "desc")
            .limit(100)
            .get();

        const seen = new Set<string>();
        const broadcasts: any[] = [];
        for (const docSnap of snap.docs) {
            const data = docSnap.data();
            const key = data.metadata?.broadcastId || docSnap.id;
            if (seen.has(key)) continue;
            seen.add(key);
            broadcasts.push({ id: docSnap.id, ...data });
        }
        return NextResponse.json(serialize(broadcasts.slice(0, 20)));
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

/** Broadcast a notification to all members or a specific role. */
export async function POST(request: Request) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canAccessAdminPanel(caller.role)) return forbidden();

    try {
        const parsed = await parseBody(request, broadcastNotificationSchema);
        if (!parsed.ok) return parsed.response;
        const body = parsed.data as any;

        const users = await adminUserService.getAll(
            body.targetRole && body.targetRole !== "ALL"
                ? (q) => q.where("role", "==", body.targetRole)
                : undefined
        );

        if (users.length === 0) {
            return NextResponse.json({ error: "No recipients match this audience" }, { status: 400 });
        }

        const broadcastId = `broadcast-${Date.now()}`;
        const now = Timestamp.now();

        // Firestore batches cap at 500 writes
        const chunks: any[][] = [];
        for (let i = 0; i < users.length; i += 500) chunks.push(users.slice(i, i + 500));

        for (const chunk of chunks) {
            const batch = adminDb.batch();
            for (const user of chunk) {
                const ref = adminDb.collection("notifications").doc();
                batch.set(ref, {
                    title: body.title,
                    content: body.content,
                    userId: user.id,
                    type: body.type || "ANNOUNCEMENT",
                    read: false,
                    actionUrl: body.actionUrl || null,
                    metadata: { broadcastId, sentBy: caller.uid },
                    createdAt: now,
                });
            }
            await batch.commit();
        }

        return NextResponse.json({ success: true, recipients: users.length }, { status: 201 });
    } catch (error) {
        console.error("Error broadcasting notification:", error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}
