"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, Upload } from "lucide-react";
import FileUpload from "@/components/ui/file-upload";

export default function UploadMediaPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "SERMONS",
        type: "IMAGE",
        isPublic: true,
    });

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileUrl) {
            toast({
                title: "Error",
                description: "Please upload a file first",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("/api/media", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    url: fileUrl,
                    filename: fileUrl.split("/").pop() || "unknown",
                    folder: "uploads",
                    uploadedBy: "admin", // Placeholder
                }),
            });

            if (!response.ok) throw new Error("Failed to save media");

            toast({
                title: "Success",
                description: "Media uploaded successfully",
            });

            router.push("/admin/media");
        } catch (error) {
            console.error("Error uploading media:", error);
            toast({
                title: "Error",
                description: "Failed to upload media",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Upload Media</h1>
                <p className="text-muted-foreground">
                    Add new photos, videos, or documents to the library
                </p>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleUpload} className="space-y-8">
                    <div className="space-y-4">
                        <Label>File</Label>
                        <FileUpload
                            value={fileUrl ? [fileUrl] : []}
                            onChange={(url) => setFileUrl(url)}
                            onRemove={() => setFileUrl("")}
                            variant={formData.type.toLowerCase() as any}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Sunday Service"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IMAGE">Image</SelectItem>
                                    <SelectItem value="VIDEO">Video</SelectItem>
                                    <SelectItem value="AUDIO">Audio</SelectItem>
                                    <SelectItem value="DOCUMENT">Document</SelectItem>
                                </SelectContent>
                            </Select>
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
                            placeholder="Optional description..."
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

                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upload Media
                    </Button>
                </form>
            </div>
        </div>
    );
}
