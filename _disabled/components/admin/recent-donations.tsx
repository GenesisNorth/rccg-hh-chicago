"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface RecentDonation {
  id: string;
  amount: number;
  type: "TITHE" | "OFFERING" | "DONATION";
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  donor?: {
    name: string;
  };
}

export function RecentDonations() {
  const [donations, setDonations] = useState<RecentDonation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      try {
        const response = await fetch("/api/admin/donations/recent?limit=5");
        if (response.ok) {
          const data = await response.json();
          setDonations(data);
        } else {
          // Mock data for demo
          setDonations([
            {
              id: "1",
              amount: 25000,
              type: "TITHE",
              status: "COMPLETED",
              createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              donor: { name: "John Doe" },
            },
            {
              id: "2",
              amount: 15000,
              type: "OFFERING",
              status: "COMPLETED",
              createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
              donor: { name: "Jane Smith" },
            },
            {
              id: "3",
              amount: 50000,
              type: "DONATION",
              status: "PENDING",
              createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            },
            {
              id: "4",
              amount: 10000,
              type: "TITHE",
              status: "COMPLETED",
              createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
              donor: { name: "Mike Johnson" },
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching recent donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDonations();
  }, []);

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "TITHE":
        return "default";
      case "OFFERING":
        return "secondary";
      case "DONATION":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "PENDING":
        return "secondary";
      case "FAILED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>
            Latest giving and financial transactions
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/donations">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No recent donations to display
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {formatAmount(donation.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {donation.donor?.name || "Anonymous"} • {" "}
                      {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getTypeBadgeVariant(donation.type)} className="text-xs">
                    {donation.type}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(donation.status)} className="text-xs">
                    {donation.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}