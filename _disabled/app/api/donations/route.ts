import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, canAccessAdminPanel } from "@/lib/server-auth";
import { adminDonationService, serialize } from "@/lib/admin-firestore";
import { parseBody, createDonationSchema } from "@/lib/validation";

export async function GET() {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        // Admins see the full ledger; members see only their own giving history
        const donations = canAccessAdminPanel(caller.role)
            ? await adminDonationService.getAll((q) => q.orderBy("createdAt", "desc"))
            : await adminDonationService.getAll((q) =>
                  q.where("userId", "==", caller.uid).orderBy("createdAt", "desc")
              );
        return NextResponse.json(serialize(donations));
    } catch (error) {
        console.error("Error fetching donations:", error);
        return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const parsed = await parseBody(request, createDonationSchema);
        if (!parsed.ok) return parsed.response;
        const body = parsed.data as any;

        // Payment verification is MANDATORY — a donation only exists if Paystack confirms it
        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!paystackSecretKey) {
            console.error("PAYSTACK_SECRET_KEY is not configured");
            return NextResponse.json({ error: "Payment verification unavailable" }, { status: 500 });
        }

        const verifyResponse = await fetch(
            `https://api.paystack.co/transaction/verify/${encodeURIComponent(body.reference)}`,
            { headers: { Authorization: `Bearer ${paystackSecretKey}` } }
        );
        const verifyData = verifyResponse.ok ? await verifyResponse.json() : null;

        if (!verifyData || verifyData.data?.status !== "success") {
            return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
        }

        // Amount must match what Paystack actually collected (kobo)
        const paidKobo = verifyData.data.amount ?? 0;
        const claimedKobo = Math.round(parseFloat(body.amount) * 100);
        if (paidKobo !== claimedKobo) {
            console.error(`Donation amount mismatch: claimed ${claimedKobo}, paid ${paidKobo}`);
            return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
        }

        // Idempotency: one donation per Paystack reference
        const duplicates = await adminDonationService.getAll((q) =>
            q.where("reference", "==", body.reference)
        );
        if (duplicates.length > 0) {
            return NextResponse.json(serialize({ id: duplicates[0].id, ...duplicates[0] }), { status: 200 });
        }

        // Donor identity comes from the session when present — never trusted from the body
        const caller = await getAuthenticatedUser();

        const donationData = {
            amount: paidKobo / 100,
            currency: verifyData.data.currency || body.currency || "NGN",
            type: body.type,
            ministry: body.ministry || null,
            isRecurring: Boolean(body.isRecurring),
            frequency: body.isRecurring ? body.frequency || null : null,
            paymentMethod: "PAYSTACK",
            reference: body.reference,
            donorEmail: verifyData.data.customer?.email || body.donorEmail || null,
            donorName: body.isAnonymous ? null : body.donorName || caller?.name || null,
            isAnonymous: Boolean(body.isAnonymous),
            userId: caller?.uid || null,
            donorId: caller?.uid || null,
            status: "COMPLETED", // server-decided; never from the request body
        };

        const id = await adminDonationService.create(donationData);
        return NextResponse.json(serialize({ id, ...donationData }), { status: 201 });
    } catch (error) {
        console.error("Error creating donation:", error);
        return NextResponse.json({ error: "Failed to record donation" }, { status: 500 });
    }
}
