import { NextResponse } from "next/server";
import { UserRole } from "@/lib/firestore-types";
import {
    getAuthenticatedUser,
    unauthorized,
    forbidden,
    canManageUsers,
    isSuperAdmin,
} from "@/lib/server-auth";
import { adminUserService, serialize, toTimestamp } from "@/lib/admin-firestore";
import { adminAuth } from "@/lib/firebase-admin";

// Fields a user may edit on their own profile
const SELF_EDITABLE = new Set([
    "name", "bio", "phone", "address", "gender", "dateOfBirth", "occupation",
    "maritalStatus", "anniversary", "joinedChurchDate", "emergencyContact",
    "image", "imagePublicId", "notificationPrefs", "theme", "privacySettings",
]);

const DATE_FIELDS = ["dateOfBirth", "anniversary", "joinedChurchDate"];

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        const { id } = await params;
        const user = await adminUserService.getById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isSelf = caller.uid === id;
        if (isSelf || canManageUsers(caller.role)) {
            return NextResponse.json(serialize(user));
        }

        // Other members: respect privacy settings
        const privacy = (user as any).privacySettings || {};
        if ((privacy.profileVisibility ?? "members") === "private") {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const u = user as any;
        return NextResponse.json(serialize({
            id: u.id,
            name: u.name,
            image: u.image,
            role: u.role,
            bio: u.bio,
            occupation: u.occupation,
            departmentIds: u.departmentIds || [],
            email: privacy.showEmail ? u.email : null,
            phone: privacy.showPhone ? u.phone : null,
            dateOfBirth: privacy.showBirthday ? u.dateOfBirth : null,
            joinedChurchDate: u.joinedChurchDate,
            createdAt: u.createdAt,
        }));
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        const { id } = await params;
        const isSelf = caller.uid === id;
        const isAdmin = canManageUsers(caller.role);
        if (!isSelf && !isAdmin) return forbidden();

        const body = await request.json();
        const updateData: Record<string, any> = {};

        for (const [key, value] of Object.entries(body)) {
            if (SELF_EDITABLE.has(key)) {
                updateData[key] = DATE_FIELDS.includes(key) && value
                    ? toTimestamp(value as string)
                    : value;
            }
        }

        // Role changes: admins only; granting/removing privileged roles is SUPERADMIN-only
        if (body.role && body.role !== undefined) {
            if (!isAdmin) return forbidden();

            const target = await adminUserService.getById(id);
            if (!target) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const privileged = [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PASTOR];
            const touchesPrivileged =
                privileged.includes(body.role) || privileged.includes((target as any).role);
            if (touchesPrivileged && !isSuperAdmin(caller.role)) return forbidden();

            updateData.role = body.role;
        }

        if (isAdmin && body.departmentIds) updateData.departmentIds = body.departmentIds;
        if (isAdmin && body.ledDepartmentIds) updateData.ledDepartmentIds = body.ledDepartmentIds;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        await adminUserService.update(id, updateData);

        // Keep custom claims in sync so storage.rules role checks work (FIX_TRACKER 3.4)
        if (updateData.role) {
            await adminAuth.setCustomUserClaims(id, { role: updateData.role });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canManageUsers(caller.role)) return forbidden();

    try {
        const { id } = await params;

        // Deleting privileged accounts is SUPERADMIN-only; nobody deletes themselves
        if (id === caller.uid) {
            return NextResponse.json({ error: "You can't delete your own account" }, { status: 400 });
        }
        const target = await adminUserService.getById(id);
        const privileged = [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PASTOR];
        if (target && privileged.includes((target as any).role) && !isSuperAdmin(caller.role)) {
            return forbidden();
        }

        await adminUserService.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
