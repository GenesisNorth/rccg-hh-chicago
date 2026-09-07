"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Donation {
    id: string;
    amount: number;
    type: string;
    donorName: string;
    status: string;
    createdAt: string;
    paymentMethod: string;
}

export default function AdminDonationsPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch("/api/donations");
            if (response.ok) {
                const data = await response.json();
                setDonations(data);
            }
        } catch (error) {
            console.error("Error fetching donations:", error);
            toast({
                title: "Error",
                description: "Failed to load donations",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
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
                <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
                <p className="text-muted-foreground">
                    Track and manage church donations
                </p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Donor</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {donations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No donations found
                                </TableCell>
                            </TableRow>
                        ) : (
                            donations.map((donation) => (
                                <TableRow key={donation.id}>
                                    <TableCell className="font-medium">{donation.donorName || "Anonymous"}</TableCell>
                                    <TableCell className="capitalize">{donation.type.toLowerCase()}</TableCell>
                                    <TableCell>₦{donation.amount.toLocaleString()}</TableCell>
                                    <TableCell className="capitalize">{donation.paymentMethod?.toLowerCase()}</TableCell>
                                    <TableCell>
                                        <Badge variant={donation.status === "COMPLETED" ? "default" : "secondary"}>
                                            {donation.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {donation.createdAt && format(new Date(donation.createdAt), "PPP")}
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
