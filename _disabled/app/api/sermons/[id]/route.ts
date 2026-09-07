import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canManageContent } from "@/lib/server-auth";
import { adminSermonService, serialize } from "@/lib/admin-firestore";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sermon = await adminSermonService.getById((await params).id);
        if (!sermon) return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
        return NextResponse.json(serialize(sermon));
    } catch (error) {
        console.error("Error fetching sermon:", error);
        return NextResponse.json({ error: "Failed to fetch sermon" }, { status: 500 });
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
        await adminSermonService.update((await params).id, body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating sermon:", error);
        return NextResponse.json({ error: "Failed to update sermon" }, { status: 500 });
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
        await adminSermonService.delete((await params).id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting sermon:", error);
        return NextResponse.json({ error: "Failed to delete sermon" }, { status: 500 });
    }
}
