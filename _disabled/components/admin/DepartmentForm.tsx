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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const departmentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    leaderId: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
    initialData?: any;
    mode: "create" | "edit";
    onSuccess?: () => void;
}

export function DepartmentForm({ initialData, mode, onSuccess }: DepartmentFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            leaderId: "",
        },
    });

    const onSubmit = async (data: DepartmentFormValues) => {
        try {
            setLoading(true);
            const url = mode === "create" ? "/api/departments" : `/api/departments/${initialData.id}`;
            const method = mode === "create" ? "POST" : "PATCH";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Failed to save department");

            toast({
                title: "Success",
                description: `Department ${mode === "create" ? "created" : "updated"} successfully`,
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error saving department:", error);
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
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Choir, Ushers, Media" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe the department's role and responsibilities..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === "create" ? "Create Department" : "Update Department"}
                </Button>
            </form>
        </Form>
    );
}
