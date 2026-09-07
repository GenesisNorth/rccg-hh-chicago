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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import FileUpload from "@/components/ui/file-upload";

const devotionalSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    scripture: z.string().min(5, "Scripture reference is required"),
    content: z.string().min(20, "Content must be at least 20 characters"),
    prayerPoint: z.string().min(10, "Prayer point is required"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    authorName: z.string().min(2, "Author name is required"),
    image: z.string().optional(),
    isPublished: z.boolean().default(true),
});

type DevotionalFormValues = z.infer<typeof devotionalSchema>;

interface DevotionalFormProps {
    initialData?: any;
    mode: "create" | "edit";
    onSuccess?: () => void;
}

export function DevotionalForm({ initialData, mode, onSuccess }: DevotionalFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<DevotionalFormValues>({
        resolver: zodResolver(devotionalSchema),
        defaultValues: initialData ? {
            ...initialData,
            date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : "",
        } : {
            title: "",
            scripture: "",
            content: "",
            prayerPoint: "",
            date: new Date().toISOString().slice(0, 10),
            authorName: "Pastor",
            image: "",
            isPublished: true,
        },
    });

    const onSubmit = async (data: DevotionalFormValues) => {
        try {
            setLoading(true);
            const url = mode === "create" ? "/api/devotionals" : `/api/devotionals/${initialData.id}`;
            const method = mode === "create" ? "POST" : "PATCH";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Failed to save devotional");

            toast({
                title: "Success",
                description: `Devotional ${mode === "create" ? "created" : "updated"} successfully`,
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error saving devotional:", error);
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
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Walking in Faith" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="scripture"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scripture Reference</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Hebrews 11:1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Write the devotional content here..."
                                    className="min-h-[200px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="prayerPoint"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prayer Point</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="A short prayer related to the topic..."
                                    className="min-h-[80px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="authorName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Pastor Williams" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cover Image (Optional)</FormLabel>
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

                <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Publish Immediately
                                </FormLabel>
                                <FormDescription>
                                    If unchecked, this devotional will be saved as a draft.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === "create" ? "Create Devotional" : "Update Devotional"}
                </Button>
            </form>
        </Form>
    );
}
