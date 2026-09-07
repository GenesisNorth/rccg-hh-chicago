import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canManageContent } from "@/lib/server-auth";
import { adminEventService, serialize, toTimestamp } from "@/lib/admin-firestore";
import { enrichEvents } from "@/lib/events-server";
import { parseBody, createEventSchema } from "@/lib/validation";

export async function GET() {
    try {
        const caller = await getAuthenticatedUser();
        const events = await adminEventService.getAll((q) => q.orderBy("startDate", "desc"));

        // Non-admins only see published/live events; admins see everything (incl. drafts)
        const visible = caller && canManageContent(caller.role)
            ? events
            : events.filter((e: any) => e.status === "PUBLISHED" || e.status === "COMPLETED" || e.status === "CANCELLED");

        const enriched = await enrichEvents(serialize(visible), caller?.uid ?? null);
        return NextResponse.json(enriched);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canManageContent(caller.role)) return forbidden();

    try {
        const parsed = await parseBody(request, createEventSchema);
        if (!parsed.ok) return parsed.response;
        const body = parsed.data as any;

        const eventData = {
            ...body,
            startDate: toTimestamp(body.startDate),
            endDate: toTimestamp(body.endDate),
            registrationDeadline: toTimestamp(body.registrationDeadline),
            organizerId: body.organizerId || caller.uid,
            organizerName: body.organizerName || caller.name || "Church Office",
            tags: body.tags || [],
            status: body.status || "DRAFT",
            registrationRequired: body.registrationRequired || false,
        };

        const id = await adminEventService.create(eventData);
        return NextResponse.json({ id, ...body }, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}
