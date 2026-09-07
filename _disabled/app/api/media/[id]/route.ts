import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canManageContent } from "@/lib/server-auth";
import { adminMediaService, serialize } from "@/lib/admin-firestore";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const media = await adminMediaService.getById((await params).id);
        if (!media) return NextResponse.json({ error: "Media not found" }, { status: 404 });

        if (!(media as any).isPublic) {
            const caller = await getAuthenticatedUser();
            if (!caller || !canManageContent(caller.role)) {
                return NextResponse.json({ error: "Media not found" }, { status: 404 });
            }
        }
        return NextResponse.json(serialize(media));
    } catch (error) {
        console.error("Error fetching media:", error);
        return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canManageContent(caller.role)) return forbidden();

    try {
        const body = await request.json();
        await adminMediaService.update((await params).id, body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating media:", error);
        return NextResponse.json({ error: "Failed to update media" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canManageContent(caller.role)) return forbidden();

    try {
        await adminMediaService.delete((await params).id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting media:", error);
        return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
    }
}
