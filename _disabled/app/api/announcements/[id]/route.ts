import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canManageContent } from "@/lib/server-auth";
import { adminAnnouncementService, serialize, toTimestamp } from "@/lib/admin-firestore";

async function canEdit(callerUid: string, callerRole: string, announcementId: string) {
    const announcement = await adminAnnouncementService.getById(announcementId);
    if (!announcement) return { announcement: null, allowed: false };
    const isAuthor = (announcement as any).author?.id === callerUid;
    return { announcement, allowed: isAuthor || canManageContent(callerRole) };
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const announcement = await adminAnnouncementService.getById((await params).id);
        if (!announcement) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
        return NextResponse.json(serialize(announcement));
    } catch (error) {
        console.error("Error fetching announcement:", error);
        return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        const { id } = await params;
        const { announcement, allowed } = await canEdit(caller.uid, caller.role, id);
        if (!announcement) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
        if (!allowed) return forbidden();

        const body = await request.json();
        const updateData: Record<string, any> = {};
        for (const key of ["title", "content", "category", "priority", "audience", "targetMinistry", "isActive"]) {
            if (body[key] !== undefined) updateData[key] = body[key];
        }
        if (body.expiresAt !== undefined) updateData.expiresAt = toTimestamp(body.expiresAt);
        if (body.scheduledFor !== undefined) updateData.scheduledFor = toTimestamp(body.scheduledFor);

        await adminAnnouncementService.update(id, updateData);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating announcement:", error);
        return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        const { id } = await params;
        const { announcement, allowed } = await canEdit(caller.uid, caller.role, id);
        if (!announcement) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
        if (!allowed) return forbidden();

        await adminAnnouncementService.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
    }
}
