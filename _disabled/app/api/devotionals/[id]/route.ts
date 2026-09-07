import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canManageContent } from "@/lib/server-auth";
import { adminDevotionalService, serialize, toTimestamp } from "@/lib/admin-firestore";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const devotional = await adminDevotionalService.getById((await params).id);
        if (!devotional) return NextResponse.json({ error: "Devotional not found" }, { status: 404 });
        return NextResponse.json(serialize(devotional));
    } catch (error) {
        console.error("Error fetching devotional:", error);
        return NextResponse.json({ error: "Failed to fetch devotional" }, { status: 500 });
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
        const updateData: Record<string, any> = { ...body };
        if (updateData.date) updateData.date = toTimestamp(updateData.date);

        await adminDevotionalService.update((await params).id, updateData);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating devotional:", error);
        return NextResponse.json({ error: "Failed to update devotional" }, { status: 500 });
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
        await adminDevotionalService.delete((await params).id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting devotional:", error);
        return NextResponse.json({ error: "Failed to delete devotional" }, { status: 500 });
    }
}
