import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canAccessAdminPanel } from "@/lib/server-auth";
import {
    adminUserService,
    adminSermonService,
    adminDonationService,
} from "@/lib/admin-firestore";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function GET() {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canAccessAdminPanel(caller.role)) return forbidden();

    try {
        const [users, sermons, donations] = await Promise.all([
            adminUserService.getAll(),
            adminSermonService.getAll(),
            adminDonationService.getAll(),
        ]);

        // Last 6 calendar months, oldest first
        const now = new Date();
        const buckets = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            return { year: d.getFullYear(), month: d.getMonth(), name: MONTHS[d.getMonth()], users: 0, sermons: 0, donations: 0 };
        });

        const bucketFor = (ts: any) => {
            if (!ts?.toDate) return null;
            const d = ts.toDate();
            return buckets.find((b) => b.year === d.getFullYear() && b.month === d.getMonth()) ?? null;
        };

        for (const u of users as any[]) { const b = bucketFor(u.createdAt); if (b) b.users++; }
        for (const s of sermons as any[]) { const b = bucketFor(s.createdAt); if (b) b.sermons++; }
        for (const d of donations as any[]) {
            if (d.status !== "COMPLETED") continue;
            const b = bucketFor(d.createdAt);
            if (b) b.donations += d.amount || 0;
        }

        return NextResponse.json(buckets.map(({ name, users, sermons, donations }) => ({ name, users, sermons, donations })));
    } catch (error) {
        console.error("Error fetching admin charts:", error);
        return NextResponse.json({ error: "Failed to fetch charts" }, { status: 500 });
    }
}
