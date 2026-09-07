"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Edit, Video, Mic } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Sermon {
    id: string;
    title: string;
    content: string;
    videoUrls: string[];
    audioUrls: string[];
    createdAt: string;
}

export default function AdminSermonsPage() {
    const [sermons, setSermons] = useState<Sermon[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchSermons();
    }, []);

    const fetchSermons = async () => {
        try {
            const response = await fetch("/api/sermons");
            if (response.ok) {
                const data = await response.json();
                setSermons(data);
            }
        } catch (error) {
            console.error("Error fetching sermons:", error);
            toast({
                title: "Error",
                description: "Failed to load sermons",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this sermon?")) return;

        try {
            const response = await fetch(`/api/sermons/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setSermons(sermons.filter((s) => s.id !== id));
                toast({
                    title: "Success",
                    description: "Sermon deleted successfully",
                });
            } else {
                throw new Error("Failed to delete sermon");
            }
        } catch (error) {
            console.error("Error deleting sermon:", error);
            toast({
                title: "Error",
                description: "Failed to delete sermon",
                variant: "destructive",
            });
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sermons</h1>
                    <p className="text-muted-foreground">
                        Manage your sermon library
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/sermons/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Sermon
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Media</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sermons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No sermons found
                                </TableCell>
                            </TableRow>
                        ) : (
                            sermons.map((sermon) => (
                                <TableRow key={sermon.id}>
                                    <TableCell className="font-medium">{sermon.title}</TableCell>
                                    <TableCell>
                                        {sermon.createdAt && format(new Date(sermon.createdAt), "PPP")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {sermon.videoUrls?.length > 0 && (
                                                <Video className="h-4 w-4 text-blue-500" />
                                            )}
                                            {sermon.audioUrls?.length > 0 && (
                                                <Mic className="h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(sermon.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
