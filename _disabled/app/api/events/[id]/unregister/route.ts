import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized } from "@/lib/server-auth";
import { adminEventRegistrationService } from "@/lib/admin-firestore";

/**
 * Cancels the caller's registration for an event.
 * Deletes their registration doc(s) for this event; no-op if none exist.
 * Paid registrations are removed too — refunds are handled out-of-band.
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        const eventId = (await params).id;
        const regs = await adminEventRegistrationService.getAll((q) =>
            q.where("eventId", "==", eventId).where("userId", "==", caller.uid)
        );

        if (regs.length === 0) {
            return NextResponse.json({ error: "You're not registered for this event" }, { status: 404 });
        }

        await Promise.all(regs.map((r: any) => adminEventRegistrationService.delete(r.id)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error unregistering from event:", error);
        return NextResponse.json({ error: "Failed to unregister" }, { status: 500 });
    }
}
