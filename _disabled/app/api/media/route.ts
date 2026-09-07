import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canManageContent } from "@/lib/server-auth";
import { adminMediaService, serialize } from "@/lib/admin-firestore";
import { parseBody, createMediaSchema } from "@/lib/validation";

export async function GET() {
    try {
        const caller = await getAuthenticatedUser();
        const isAdmin = caller && canManageContent(caller.role);

        const mediaItems = await adminMediaService.getAll((q) => q.orderBy("createdAt", "desc"));
        const visible = isAdmin ? mediaItems : mediaItems.filter((m: any) => m.isPublic === true);
        return NextResponse.json(serialize(visible));
    } catch (error) {
        console.error("Error fetching media:", error);
        return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canManageContent(caller.role)) return forbidden();

    try {
        const parsed = await parseBody(request, createMediaSchema);
        if (!parsed.ok) return parsed.response;
        const body = parsed.data as any;

        const mediaData = {
            name: body.title || body.filename,
            url: body.url,
            type: body.type,
            filename: body.filename,
            description: body.description || null,
            thumbnailUrl: body.thumbnailUrl || null,
            size: body.size || 0,
            mimeType: body.mimeType || "",
            folder: body.folder || "uploads",
            uploadedById: caller.uid,
            uploadedByName: caller.name || "Admin",
            tags: body.tags || [],
            category: body.category || null,
            isPublic: body.isPublic ?? true,
        };

        const id = await adminMediaService.create(mediaData);
        return NextResponse.json(serialize({ id, ...mediaData }), { status: 201 });
    } catch (error) {
        console.error("Error creating media:", error);
        return NextResponse.json({ error: "Failed to create media" }, { status: 500 });
    }
}
