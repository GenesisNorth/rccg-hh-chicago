import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, hasLeadershipRole } from "@/lib/server-auth";
import { adminDepartmentService, serialize } from "@/lib/admin-firestore";
import { parseBody, createDepartmentSchema } from "@/lib/validation";

export async function GET() {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        const departments = await adminDepartmentService.getAll((q) => q.orderBy("name"));
        return NextResponse.json(serialize(departments));
    } catch (error) {
        console.error("Error fetching departments:", error);
        return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!hasLeadershipRole(caller.role)) return forbidden();

    try {
        const parsed = await parseBody(request, createDepartmentSchema);
        if (!parsed.ok) return parsed.response;
        const body = parsed.data;

        const departmentData = {
            name: body.name,
            description: body.description || null,
            leaderId: body.leaderId || "",
            memberIds: body.memberIds || [],
        };

        const id = await adminDepartmentService.create(departmentData);
        return NextResponse.json(serialize({ id, ...departmentData }), { status: 201 });
    } catch (error) {
        console.error("Error creating department:", error);
        return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
    }
}
