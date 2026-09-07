import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized, forbidden, hasLeadershipRole } from "@/lib/server-auth";
import { adminDepartmentService, serialize } from "@/lib/admin-firestore";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        const department = await adminDepartmentService.getById((await params).id);
        if (!department) return NextResponse.json({ error: "Department not found" }, { status: 404 });
        return NextResponse.json(serialize(department));
    } catch (error) {
        console.error("Error fetching department:", error);
        return NextResponse.json({ error: "Failed to fetch department" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!hasLeadershipRole(caller.role)) return forbidden();

    try {
        const body = await request.json();
        await adminDepartmentService.update((await params).id, body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating department:", error);
        return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!hasLeadershipRole(caller.role)) return forbidden();

    try {
        await adminDepartmentService.delete((await params).id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting department:", error);
        return NextResponse.json({ error: "Failed to delete department" }, { status: 500 });
    }
}
