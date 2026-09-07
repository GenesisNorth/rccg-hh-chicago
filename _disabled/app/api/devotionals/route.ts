import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canManageContent } from "@/lib/server-auth";
import { adminDevotionalService, serialize, toTimestamp } from "@/lib/admin-firestore";
import { parseBody, createDevotionalSchema } from "@/lib/validation";

export async function GET() {
    try {
        const devotionals = await adminDevotionalService.getAll((q) => q.orderBy("date", "desc"));
        return NextResponse.json(serialize(devotionals));
    } catch (error) {
        console.error("Error fetching devotionals:", error);
        return NextResponse.json({ error: "Failed to fetch devotionals" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canManageContent(caller.role)) return forbidden();

    try {
        const parsed = await parseBody(request, createDevotionalSchema);
        if (!parsed.ok) return parsed.response;
        const body = parsed.data as any;

        const devotionalData = {
            title: body.title,
            content: body.content,
            scripture: body.scripture || "",
            prayerPoint: body.prayerPoint || "",
            authorId: caller.uid,
            authorName: caller.name || "Pastor",
            date: toTimestamp(body.date),
            image: body.image || null,
            tags: body.tags || [],
            likes: 0,
            views: 0,
            isPublished: body.isPublished ?? true,
        };

        const id = await adminDevotionalService.create(devotionalData);
        return NextResponse.json(serialize({ id, ...devotionalData }), { status: 201 });
    } catch (error) {
        console.error("Error creating devotional:", error);
        return NextResponse.json({ error: "Failed to create devotional" }, { status: 500 });
    }
}
