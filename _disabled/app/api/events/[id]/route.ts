import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canManageContent } from "@/lib/server-auth";
import { adminEventService, serialize, toTimestamp } from "@/lib/admin-firestore";
import { enrichEvent } from "@/lib/events-server";

const DATE_FIELDS = ["startDate", "endDate", "registrationDeadline"];

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const caller = await getAuthenticatedUser();
        const event = await adminEventService.getById((await params).id);
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
        const enriched = await enrichEvent(serialize(event), caller?.uid ?? null);
        return NextResponse.json(enriched);
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
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
        for (const field of DATE_FIELDS) {
            if (updateData[field]) updateData[field] = toTimestamp(updateData[field]);
        }

        await adminEventService.update((await params).id, updateData);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
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
        await adminEventService.delete((await params).id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}
