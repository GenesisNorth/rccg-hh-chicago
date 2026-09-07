"use client";

import { SermonForm } from "@/components/SermonForm";
import { useRouter } from "next/navigation";

export default function CreateSermonPage() {
    const router = useRouter();

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add Sermon</h1>
                <p className="text-muted-foreground">
                    Upload a new sermon to the library
                </p>
            </div>
            <div className="max-w-2xl">
                <SermonForm
                    mode="create"
                    onSuccess={() => router.push("/admin/sermons")}
                />
            </div>
        </div>
    );
}
