import { NextResponse } from "next/server";
import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { adminDonationService } from "@/lib/admin-firestore";

/**
 * Sends a donation receipt notification to the giver.
 * Replaces the old `onDonationComplete` Cloud Function trigger — runs here
 * (Admin SDK, server-side) since notification creation is admin-only under the rules.
 */
async function sendDonationReceipt(userId: string | null, amount: number, type: string) {
    if (!userId) return; // anonymous / guest gift — no one to notify
    try {
        await adminDb.collection("notifications").add({
            title: "Donation Receipt",
            content: `Thank you for your ${String(type).toLowerCase()} of ₦${amount.toLocaleString()}.`,
            userId,
            type: "DONATION",
            read: false,
            actionUrl: "/give",
            metadata: { amount, type },
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        // A failed receipt must never fail the webhook — Paystack would retry the whole event
        console.error("Failed to send donation receipt:", error);
    }
}

/**
 * Paystack webhook — reconciles donations out-of-band.
 * Configure in Paystack Dashboard → Settings → Webhooks:
 *   https://<your-domain>/api/webhooks/paystack
 */
export async function POST(request: Request) {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
        console.error("PAYSTACK_SECRET_KEY is not configured");
        return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const rawBody = await request.text();

    // Verify the webhook signature before trusting anything in the payload
    const signature = request.headers.get("x-paystack-signature");
    const expected = crypto.createHmac("sha512", paystackSecretKey).update(rawBody).digest("hex");
    if (!signature || signature !== expected) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    try {
        const payload = JSON.parse(rawBody);
        const event = payload.event as string;
        const data = payload.data;
        const reference = data?.reference as string | undefined;
        if (!reference) return NextResponse.json({ status: "ignored" });

        const matches = await adminDonationService.getAll((q) =>
            q.where("reference", "==", reference)
        );

        if (event === "charge.success") {
            if (matches.length > 0) {
                const existing = matches[0] as any;
                await adminDonationService.update(existing.id, { status: "COMPLETED" });
                // Only send a receipt the first time it transitions to COMPLETED
                if (existing.status !== "COMPLETED") {
                    await sendDonationReceipt(existing.userId ?? null, existing.amount ?? 0, existing.type ?? "donation");
                }
            } else {
                // Payment confirmed but the client never recorded it — create the record
                const amount = (data.amount ?? 0) / 100;
                const type = data.metadata?.type || "OFFERING";
                const userId = data.metadata?.userId || null;
                await adminDonationService.create({
                    amount,
                    currency: data.currency || "NGN",
                    type,
                    ministry: data.metadata?.ministry || null,
                    isRecurring: false,
                    frequency: null,
                    paymentMethod: "PAYSTACK",
                    reference,
                    donorEmail: data.customer?.email || null,
                    donorName: data.metadata?.donorName || null,
                    isAnonymous: Boolean(data.metadata?.isAnonymous),
                    userId,
                    donorId: userId,
                    status: "COMPLETED",
                    source: "webhook",
                });
                await sendDonationReceipt(userId, amount, type);
            }
        } else if (event === "charge.failed" && matches.length > 0) {
            await adminDonationService.update(matches[0].id, { status: "FAILED" });
        } else if (event === "refund.processed" && matches.length > 0) {
            await adminDonationService.update(matches[0].id, { status: "REFUNDED" });
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Paystack webhook error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
