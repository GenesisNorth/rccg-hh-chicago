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
import { Plus, Trash2, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Department {
    id: string;
    name: string;
    description: string;
    memberIds: string[];
    createdAt: string;
}

export default function AdminWorkersPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await fetch("/api/departments");
            if (response.ok) {
                const data = await response.json();
                setDepartments(data);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            toast({
                title: "Error",
                description: "Failed to load departments",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this department?")) return;

        try {
            const response = await fetch(`/api/departments/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setDepartments(departments.filter((d) => d.id !== id));
                toast({
                    title: "Success",
                    description: "Department deleted successfully",
                });
            } else {
                throw new Error("Failed to delete department");
            }
        } catch (error) {
            console.error("Error deleting department:", error);
            toast({
                title: "Error",
                description: "Failed to delete department",
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
                    <h1 className="text-3xl font-bold tracking-tight">Workers & Departments</h1>
                    <p className="text-muted-foreground">
                        Manage church departments and workforce
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/workers/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Department
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Members</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No departments found
                                </TableCell>
                            </TableRow>
                        ) : (
                            departments.map((dept) => (
                                <TableRow key={dept.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                                            {dept.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">{dept.description}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>{dept.memberIds?.length || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {dept.createdAt && format(new Date(dept.createdAt), "PPP")}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(dept.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
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
