import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser, unauthorized, forbidden, canAccessAdminPanel } from "@/lib/server-auth";
import { serialize } from "@/lib/admin-firestore";
import { parseBody, churchSettingsSchema } from "@/lib/validation";

const SETTINGS_DOC = "church";

/** Public read — service times etc. are shown on the public site. */
export async function GET() {
    try {
        const snap = await adminDb.collection("settings").doc(SETTINGS_DOC).get();
        return NextResponse.json(serialize(snap.exists ? snap.data() : {}));
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canAccessAdminPanel(caller.role)) return forbidden();

    try {
        const parsed = await parseBody(request, churchSettingsSchema);
        if (!parsed.ok) return parsed.response;
        const body = parsed.data as any;
        // Whitelist stays authoritative on what persists (schema uses passthrough)
        const allowed = [
            "churchName", "tagline", "address", "phone", "email",
            "serviceTimes", "facebookUrl", "instagramUrl", "youtubeUrl", "twitterUrl",
            "aboutBlurb", "givingNote",
        ];
        const settings: Record<string, any> = {};
        for (const key of allowed) {
            if (body[key] !== undefined) settings[key] = body[key];
        }
        settings.updatedAt = Timestamp.now();
        settings.updatedBy = caller.uid;

        await adminDb.collection("settings").doc(SETTINGS_DOC).set(settings, { merge: true });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving settings:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
