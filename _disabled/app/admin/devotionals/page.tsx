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
import { Plus, Trash2, Edit, BookOpen } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Devotional {
    id: string;
    title: string;
    scripture: string;
    authorName: string;
    date: string;
    isPublished: boolean;
}

export default function AdminDevotionalsPage() {
    const [devotionals, setDevotionals] = useState<Devotional[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchDevotionals();
    }, []);

    const fetchDevotionals = async () => {
        try {
            const response = await fetch("/api/devotionals");
            if (response.ok) {
                const data = await response.json();
                setDevotionals(data);
            }
        } catch (error) {
            console.error("Error fetching devotionals:", error);
            toast({
                title: "Error",
                description: "Failed to load devotionals",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this devotional?")) return;

        try {
            const response = await fetch(`/api/devotionals/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setDevotionals(devotionals.filter((d) => d.id !== id));
                toast({
                    title: "Success",
                    description: "Devotional deleted successfully",
                });
            } else {
                throw new Error("Failed to delete devotional");
            }
        } catch (error) {
            console.error("Error deleting devotional:", error);
            toast({
                title: "Error",
                description: "Failed to delete devotional",
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
                    <h1 className="text-3xl font-bold tracking-tight">Devotionals</h1>
                    <p className="text-muted-foreground">
                        Manage daily devotionals and spiritual content
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/devotionals/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Devotional
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Scripture</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {devotionals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No devotionals found
                                </TableCell>
                            </TableRow>
                        ) : (
                            devotionals.map((devotional) => (
                                <TableRow key={devotional.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            {devotional.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>{devotional.scripture}</TableCell>
                                    <TableCell>{devotional.authorName}</TableCell>
                                    <TableCell>
                                        {devotional.date && format(new Date(devotional.date), "PPP")}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={devotional.isPublished ? "default" : "secondary"}>
                                            {devotional.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(devotional.id)}
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
