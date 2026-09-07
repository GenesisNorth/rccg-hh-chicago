import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canAccessAdminPanel } from "@/lib/server-auth";
import {
    adminUserService,
    adminSermonService,
    adminDonationService,
    adminEventService,
} from "@/lib/admin-firestore";
import { Timestamp } from "firebase-admin/firestore";

/** % of a collection created in the last 30 days — a simple, honest growth signal. */
function growthPct(total: number, recent: number): number {
    if (total === 0) return 0;
    return Math.round((recent / total) * 1000) / 10;
}

export async function GET() {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canAccessAdminPanel(caller.role)) return forbidden();

    try {
        const thirtyDaysAgo = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const since = (q: FirebaseFirestore.Query) => q.where("createdAt", ">=", thirtyDaysAgo);

        const [
            totalUsers, recentUsers,
            totalSermons, recentSermons,
            totalEvents, recentEvents,
            donations,
        ] = await Promise.all([
            adminUserService.count(), adminUserService.count(since),
            adminSermonService.count(), adminSermonService.count(since),
            adminEventService.count(), adminEventService.count(since),
            adminDonationService.getAll(),
        ]);

        const completed = donations.filter((d: any) => d.status === "COMPLETED");
        const totalDonations = completed.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
        const recentDonations = completed
            .filter((d: any) => d.createdAt && d.createdAt.toMillis() >= thirtyDaysAgo.toMillis())
            .reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

        return NextResponse.json({
            totalUsers,
            totalSermons,
            totalDonations,
            totalEvents,
            monthlyGrowth: {
                users: growthPct(totalUsers, recentUsers),
                sermons: growthPct(totalSermons, recentSermons),
                donations: growthPct(totalDonations, recentDonations),
                events: growthPct(totalEvents, recentEvents),
            },
        });
    } catch (error) {
        console.error("Error fetching admin metrics:", error);
        return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
    }
}
