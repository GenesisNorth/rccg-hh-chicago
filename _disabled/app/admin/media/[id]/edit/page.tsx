"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function EditMediaPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        type: "",
        isPublic: true,
    });

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const response = await fetch(`/api/media/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        title: data.name || data.title, // Handle both naming conventions
                        description: data.description || "",
                        category: data.category || "SERMONS",
                        type: data.type,
                        isPublic: data.isPublic,
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to load media item",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Error fetching media:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [params.id, toast]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await fetch(`/api/media/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update media");

            toast({
                title: "Success",
                description: "Media updated successfully",
            });

            router.push("/admin/media");
        } catch (error) {
            console.error("Error updating media:", error);
            toast({
                title: "Error",
                description: "Failed to update media",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Media</h1>
                <p className="text-muted-foreground">
                    Update details for "{formData.title}"
                </p>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Input value={formData.type} disabled />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SERMONS">Sermons</SelectItem>
                                <SelectItem value="MUSIC">Music</SelectItem>
                                <SelectItem value="EVENTS">Events</SelectItem>
                                <SelectItem value="OUTREACH">Outreach</SelectItem>
                                <SelectItem value="DOCUMENTS">Documents</SelectItem>
                                <SelectItem value="GALLERY">Gallery</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="public"
                            checked={formData.isPublic}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, isPublic: checked as boolean })
                            }
                        />
                        <Label htmlFor="public">Make Public</Label>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
