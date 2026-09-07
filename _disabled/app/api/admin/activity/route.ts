import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canAccessAdminPanel } from "@/lib/server-auth";
import {
    adminUserService,
    adminSermonService,
    adminDonationService,
    adminEventService,
} from "@/lib/admin-firestore";

export async function GET() {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canAccessAdminPanel(caller.role)) return forbidden();

    try {
        const recent = (q: FirebaseFirestore.Query) => q.orderBy("createdAt", "desc").limit(5);
        const [users, sermons, donations, events] = await Promise.all([
            adminUserService.getAll(recent),
            adminSermonService.getAll(recent),
            adminDonationService.getAll(recent),
            adminEventService.getAll(recent),
        ]);

        const toIso = (ts: any) => (ts?.toDate ? ts.toDate().toISOString() : new Date().toISOString());

        const activity = [
            ...users.map((u: any) => ({
                id: `user-${u.id}`,
                type: "user",
                message: `${u.name || u.email} joined the church platform`,
                timestamp: toIso(u.createdAt),
                user: { name: u.name || u.email, image: u.image || null },
            })),
            ...sermons.map((s: any) => ({
                id: `sermon-${s.id}`,
                type: "sermon",
                message: `New sermon published: ${s.title}`,
                timestamp: toIso(s.createdAt),
                user: { name: s.preacher || s.authorName || "Church Office" },
            })),
            ...donations
                .filter((d: any) => d.status === "COMPLETED")
                .map((d: any) => ({
                    id: `donation-${d.id}`,
                    type: "donation",
                    message: d.isAnonymous
                        ? `Anonymous ${String(d.type || "donation").toLowerCase()} received`
                        : `${d.donorName || "A member"} gave a ${String(d.type || "donation").toLowerCase()}`,
                    timestamp: toIso(d.createdAt),
                    user: { name: d.isAnonymous ? "Anonymous" : d.donorName || "Member" },
                })),
            ...events.map((e: any) => ({
                id: `event-${e.id}`,
                type: "event",
                message: `Event created: ${e.title}`,
                timestamp: toIso(e.createdAt),
                user: { name: e.organizerName || "Church Office" },
            })),
        ]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 15);

        return NextResponse.json(activity);
    } catch (error) {
        console.error("Error fetching admin activity:", error);
        return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
    }
}
