import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, canManageContent } from "@/lib/server-auth";
import { adminSermonService, serialize } from "@/lib/admin-firestore";
import { parseBody, createSermonSchema } from "@/lib/validation";

export async function GET() {
    try {
        const sermons = await adminSermonService.getAll((q) => q.orderBy("createdAt", "desc"));
        return NextResponse.json(serialize(sermons));
    } catch (error) {
        console.error("Error fetching sermons:", error);
        return NextResponse.json({ error: "Failed to fetch sermons" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canManageContent(caller.role)) return forbidden();

    try {
        const parsed = await parseBody(request, createSermonSchema);
        if (!parsed.ok) return parsed.response;
        const body = parsed.data;

        const id = await adminSermonService.create(body);
        return NextResponse.json({ id, ...body }, { status: 201 });
    } catch (error) {
        console.error("Error creating sermon:", error);
        return NextResponse.json({ error: "Failed to create sermon" }, { status: 500 });
    }
}
