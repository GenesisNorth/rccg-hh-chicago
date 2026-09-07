import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser, unauthorized } from "@/lib/server-auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        const { id } = await params;
        const ref = adminDb.collection("announcements").doc(id);
        const snap = await ref.get();
        if (!snap.exists) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });

        const likedBy: string[] = snap.data()?.likedBy || [];
        const hasLiked = likedBy.includes(caller.uid);

        await ref.update({
            likedBy: hasLiked ? FieldValue.arrayRemove(caller.uid) : FieldValue.arrayUnion(caller.uid),
            "engagement.likes": FieldValue.increment(hasLiked ? -1 : 1),
        });

        return NextResponse.json({ success: true, liked: !hasLiked });
    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
    }
}
