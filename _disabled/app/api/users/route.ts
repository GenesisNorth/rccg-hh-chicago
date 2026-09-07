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
import { parseBody, createUserSchema } from "@/lib/validation";

/** Fields safe to expose to other members (privacy-filtered directory view). */
function directoryView(user: any) {
    const privacy = user.privacySettings || {};
    return {
        id: user.id,
        name: user.name,
        image: user.image,
        role: user.role,
        bio: user.bio,
        occupation: user.occupation,
        departmentIds: user.departmentIds || [],
        email: privacy.showEmail ? user.email : null,
        phone: privacy.showPhone ? user.phone : null,
        joinedChurchDate: user.joinedChurchDate,
        createdAt: user.createdAt,
    };
}

export async function GET() {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();

    try {
        const users = await adminUserService.getAll();

        if (canManageUsers(caller.role)) {
            return NextResponse.json(serialize(users));
        }

        // Members see a privacy-respecting directory; private profiles are hidden
        const directory = users
            .filter((u: any) => (u.privacySettings?.profileVisibility ?? "members") !== "private")
            .map(directoryView);
        return NextResponse.json(serialize(directory));
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const caller = await getAuthenticatedUser();
    if (!caller) return unauthorized();
    if (!canManageUsers(caller.role)) return forbidden();

    try {
        const parsed = await parseBody(request, createUserSchema);
        if (!parsed.ok) return parsed.response;
        const body = parsed.data as any;

        // Only SUPERADMIN may create privileged accounts
        const requestedRole: UserRole = body.role || UserRole.MEMBER;
        const privileged = [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PASTOR];
        if (privileged.includes(requestedRole) && !isSuperAdmin(caller.role)) {
            return forbidden();
        }

        const userData = {
            name: body.name,
            email: body.email,
            emailVerified: false,
            role: requestedRole,
            image: body.image || null,
            imagePublicId: null,
            bio: body.bio || null,
            phone: body.phone || null,
            address: body.address || null,
            gender: body.gender || null,
            dateOfBirth: toTimestamp(body.dateOfBirth),
            occupation: body.occupation || null,
            maritalStatus: body.maritalStatus || null,
            anniversary: toTimestamp(body.anniversary),
            joinedChurchDate: toTimestamp(body.joinedChurchDate) ?? toTimestamp(new Date()),
            emergencyContact: body.emergencyContact || null,
            notificationPrefs: body.notificationPrefs || {},
            theme: "light",
            privacySettings: {},
            departmentIds: body.departmentIds || [],
            ledDepartmentIds: [],
        };

        const id = await adminUserService.create(userData);
        return NextResponse.json(serialize({ id, ...userData }), { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
