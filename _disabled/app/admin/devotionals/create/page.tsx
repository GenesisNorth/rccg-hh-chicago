"use client";

import { DevotionalForm } from "@/components/admin/DevotionalForm";
import { useRouter } from "next/navigation";

export default function CreateDevotionalPage() {
    const router = useRouter();

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Devotional</h1>
                <p className="text-muted-foreground">
                    Write and publish a new daily devotional
                </p>
            </div>
            <div className="max-w-3xl">
                <DevotionalForm
                    mode="create"
                    onSuccess={() => router.push("/admin/devotionals")}
                />
            </div>
        </div>
    );
}
