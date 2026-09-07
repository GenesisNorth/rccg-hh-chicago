import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canManageContent } from "@/lib/server-auth";
import { adminAnnouncementService } from "@/lib/admin-firestore";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canManageContent(caller.role)) return forbidden();

    try {
        const { id } = await params;
        const announcement = await adminAnnouncementService.getById(id);
        if (!announcement) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });

        await adminAnnouncementService.update(id, { isPinned: !(announcement as any).isPinned });
        return NextResponse.json({ success: true, isPinned: !(announcement as any).isPinned });
    } catch (error) {
        console.error("Error toggling pin:", error);
        return NextResponse.json({ error: "Failed to update pin" }, { status: 500 });
    }
}
