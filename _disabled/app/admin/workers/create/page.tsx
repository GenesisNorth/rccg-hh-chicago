"use client";

import { DepartmentForm } from "@/components/admin/DepartmentForm";
import { useRouter } from "next/navigation";

export default function CreateDepartmentPage() {
    const router = useRouter();

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Department</h1>
                <p className="text-muted-foreground">
                    Establish a new department or ministry unit
                </p>
            </div>
            <div className="max-w-2xl">
                <DepartmentForm
                    mode="create"
                    onSuccess={() => router.push("/admin/workers")}
                />
            </div>
        </div>
    );
}
