"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import FileUpload from "@/components/ui/file-upload";

const eventSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
    location: z.string().min(2, "Location is required"),
    category: z.string().min(1, "Category is required"),
    capacity: z.string().optional().transform(val => val ? parseInt(val, 10) : null),
    price: z.string().optional().transform(val => val ? parseFloat(val) : null),
    registrationRequired: z.boolean().default(false),
    image: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
    initialData?: any;
    mode: "create" | "edit";
    onSuccess?: () => void;
}

export function EventForm({ initialData, mode, onSuccess }: EventFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: initialData ? {
            ...initialData,
            startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : "",
            endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : "",
            capacity: initialData.capacity?.toString() || "",
            price: initialData.price?.toString() || "",
        } : {
            title: "",
            description: "",
            startDate: "",
            endDate: "",
            location: "",
            category: "",
            capacity: "",
            price: "",
            registrationRequired: false,
            image: "",
        },
    });

    const onSubmit = async (data: EventFormValues) => {
        try {
            setLoading(true);
            const url = mode === "create" ? "/api/events" : `/api/events/${initialData.id}`;
            const method = mode === "create" ? "POST" : "PATCH";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Failed to save event");

            toast({
                title: "Success",
                description: `Event ${mode === "create" ? "created" : "updated"} successfully`,
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error saving event:", error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Event Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Sunday Service" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="WORSHIP">Worship</SelectItem>
                                        <SelectItem value="YOUTH">Youth</SelectItem>
                                        <SelectItem value="WOMEN">Women</SelectItem>
                                        <SelectItem value="MEN">Men</SelectItem>
                                        <SelectItem value="CHILDREN">Children</SelectItem>
                                        <SelectItem value="SPIRITUAL">Spiritual</SelectItem>
                                        <SelectItem value="COMMUNITY">Community</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Event details..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date & Time</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date & Time</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Main Sanctuary" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacity (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Max attendees" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0.00" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="registrationRequired"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-8">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Registration Required
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Image</FormLabel>
                            <FormControl>
                                <FileUpload
                                    value={field.value ? [field.value] : []}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")}
                                    variant="image"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === "create" ? "Create Event" : "Update Event"}
                </Button>
            </form>
        </Form>
    );
}
