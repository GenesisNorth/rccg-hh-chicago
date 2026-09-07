"use client";

import { EventForm } from "@/components/admin/EventForm";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
    const router = useRouter();

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
                <p className="text-muted-foreground">
                    Add a new event to the church calendar
                </p>
            </div>
            <div className="max-w-2xl">
                <EventForm
                    mode="create"
                    onSuccess={() => router.push("/admin/events")}
                />
            </div>
        </div>
    );
}
