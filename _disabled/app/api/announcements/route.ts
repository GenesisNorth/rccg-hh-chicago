import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, hasLeadershipRole } from "@/lib/server-auth";
import { adminAnnouncementService, serialize, toTimestamp } from "@/lib/admin-firestore";
import { parseBody, createAnnouncementSchema } from "@/lib/validation";

export async function GET() {
    try {
        const announcements = await adminAnnouncementService.getAll((q) =>
            q.orderBy("createdAt", "desc")
        );
        return NextResponse.json(serialize(announcements));
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!hasLeadershipRole(caller.role)) return forbidden();

    try {
        const parsed = await parseBody(request, createAnnouncementSchema);
        if (!parsed.ok) return parsed.response;
        const body = parsed.data as any;

        const announcementData = {
            title: body.title,
            content: body.content,
            author: {
                id: caller.uid,
                name: caller.name || "Church Office",
                avatar: body.author?.avatar ?? null,
                role: caller.role,
            },
            category: body.category || "general",
            priority: body.priority || "normal",
            audience: body.audience || "everyone",
            targetMinistry: body.targetMinistry || null,
            isPinned: false,
            isActive: true,
            expiresAt: toTimestamp(body.expiresAt),
            scheduledFor: toTimestamp(body.scheduledFor),
            engagement: { views: 0, likes: 0, comments: 0 },
            likedBy: [],
        };

        const id = await adminAnnouncementService.create(announcementData);
        const created = await adminAnnouncementService.getById(id);
        return NextResponse.json(serialize(created), { status: 201 });
    } catch (error) {
        console.error("Error creating announcement:", error);
        return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
    }
}
