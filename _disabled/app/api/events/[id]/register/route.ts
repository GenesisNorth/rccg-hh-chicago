import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAuthenticatedUser, unauthorized } from "@/lib/server-auth";
import {
    adminEventService,
    adminEventRegistrationService,
    serialize,
} from "@/lib/admin-firestore";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        const eventId = (await params).id;
        const body = await request.json().catch(() => ({}));

        const event = await adminEventService.getById(eventId);
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // One registration per user per event
        const existing = await adminEventRegistrationService.getAll((q) =>
            q.where("eventId", "==", eventId).where("userId", "==", caller.uid)
        );
        if (existing.length > 0) {
            return NextResponse.json({ error: "You're already registered for this event" }, { status: 409 });
        }

        // Capacity check
        if ((event as any).capacity) {
            const registered = await adminEventRegistrationService.count((q) =>
                q.where("eventId", "==", eventId)
            );
            if (registered >= (event as any).capacity) {
                return NextResponse.json({ error: "This event is fully booked" }, { status: 409 });
            }
        }

        // Paid events require verified payment — no key, no verification, no registration
        let paymentStatus: "PAID" | "NOT_REQUIRED" = "NOT_REQUIRED";
        let paymentRef: string | null = null;

        if ((event as any).price && (event as any).price > 0) {
            if (!body.paymentRef) {
                return NextResponse.json({ error: "Payment reference required for paid events" }, { status: 400 });
            }
            const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
            if (!paystackSecretKey) {
                console.error("PAYSTACK_SECRET_KEY is not configured");
                return NextResponse.json({ error: "Payment verification unavailable" }, { status: 500 });
            }

            const verifyResponse = await fetch(
                `https://api.paystack.co/transaction/verify/${encodeURIComponent(body.paymentRef)}`,
                { headers: { Authorization: `Bearer ${paystackSecretKey}` } }
            );
            const verifyData = verifyResponse.ok ? await verifyResponse.json() : null;
            const paidKobo = verifyData?.data?.amount ?? 0;
            const expectedKobo = Math.round((event as any).price * 100);

            if (!verifyData || verifyData.data?.status !== "success" || paidKobo < expectedKobo) {
                return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
            }
            paymentStatus = "PAID";
            paymentRef = body.paymentRef;
        }

        const registrationData = {
            eventId,
            userId: caller.uid,
            userName: caller.name || body.userName || "Unknown",
            userEmail: caller.email,
            status: "REGISTERED" as const,
            paymentStatus,
            paymentRef,
            registeredAt: Timestamp.now(),
            attendedAt: null,
        };

        const id = await adminEventRegistrationService.create(registrationData);
        return NextResponse.json({ success: true, registration: serialize({ id, ...registrationData }) });
    } catch (error) {
        console.error("Error registering for event:", error);
        return NextResponse.json({ error: "Failed to register" }, { status: 500 });
    }
}
