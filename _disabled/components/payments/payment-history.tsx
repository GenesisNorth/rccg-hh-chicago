"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Eye,
  MoreHorizontal,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  Loader2,
  FileText,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

interface Donation {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  type: "TITHE" | "OFFERING" | "DONATION" | "PROJECT";
  ministry?: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentMethod: "PAYSTACK" | "STRIPE" | "PAYPAL" | "OFFLINE";
  isRecurring: boolean;
  frequency?: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  createdAt: string;
  completedAt?: string;
  metadata?: {
    processorReference?: string;
    receiptUrl?: string;
    notes?: string;
  };
}

interface PaymentStats {
  totalDonations: number;
  totalAmount: number;
  currentYear: number;
  lastYear: number;
  monthlyGiving: Array<{
    month: string;
    amount: number;
  }>;
}

export function PaymentHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        const [donationsResponse, statsResponse] = await Promise.all([
          fetch("/api/donations/history"),
          fetch("/api/donations/stats"),
        ]);

        if (donationsResponse.ok && statsResponse.ok) {
          const [donationsData, statsData] = await Promise.all([
            donationsResponse.json(),
            statsResponse.json(),
          ]);
          
          setDonations(donationsData);
          setStats(statsData);
        } else {
          // Mock data for demo
          const mockDonations: Donation[] = [
            {
              id: "1",
              reference: "LSC-2024-001",
              amount: 50000,
              currency: "NGN",
              type: "TITHE",
              status: "COMPLETED",
              paymentMethod: "PAYSTACK",
              isRecurring: true,
              frequency: "MONTHLY",
              createdAt: "2024-01-15T10:00:00Z",
              completedAt: "2024-01-15T10:02:00Z",
              metadata: {
                processorReference: "PST_abc123",
                receiptUrl: "/receipts/LSC-2024-001.pdf",
              },
            },
            {
              id: "2",
              reference: "LSC-2024-002",
              amount: 25000,
              currency: "NGN",
              type: "OFFERING",
              status: "COMPLETED",
              paymentMethod: "STRIPE",
              isRecurring: false,
              createdAt: "2024-01-10T15:30:00Z",
              completedAt: "2024-01-10T15:31:00Z",
              metadata: {
                processorReference: "pi_abc123def456",
                receiptUrl: "/receipts/LSC-2024-002.pdf",
              },
            },
            {
              id: "3",
              reference: "LSC-2024-003",
              amount: 100000,
              currency: "NGN",
              type: "PROJECT",
              status: "COMPLETED",
              paymentMethod: "PAYSTACK",
              isRecurring: false,
              createdAt: "2024-01-08T09:15:00Z",
              completedAt: "2024-01-08T09:17:00Z",
              metadata: {
                processorReference: "PST_xyz789",
                receiptUrl: "/receipts/LSC-2024-003.pdf",
                notes: "Building Fund Contribution",
              },
            },
            {
              id: "4",
              reference: "LSC-2024-004",
              amount: 15000,
              currency: "NGN",
              type: "DONATION",
              ministry: "Youth Ministry",
              status: "PENDING",
              paymentMethod: "PAYSTACK",
              isRecurring: false,
              createdAt: "2024-01-20T14:45:00Z",
            },
          ];

          const mockStats: PaymentStats = {
            totalDonations: 4,
            totalAmount: 190000,
            currentYear: 190000,
            lastYear: 450000,
            monthlyGiving: [
              { month: "Jan", amount: 190000 },
              { month: "Dec", amount: 85000 },
              { month: "Nov", amount: 120000 },
              { month: "Oct", amount: 95000 },
            ],
          };

          setDonations(mockDonations);
          setStats(mockStats);

          toast({
            title: "Demo Mode",
            description: "Showing sample payment history. Connect to API for live data.",
          });
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
        toast({
          title: "Error",
          description: "Failed to load payment history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPaymentHistory();
    }
  }, [user, toast]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "PENDING":
        return "secondary";
      case "FAILED":
        return "destructive";
      case "REFUNDED":
        return "outline";
      default:
        return "outline";
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "TITHE":
        return "default";
      case "OFFERING":
        return "secondary";
      case "DONATION":
        return "outline";
      case "PROJECT":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currency === "NGN" ? "₦" : currency === "USD" ? "$" : "£";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const downloadReceipt = async (donation: Donation) => {
    try {
      if (donation.metadata?.receiptUrl) {
        // Download existing receipt
        const link = document.createElement('a');
        link.href = donation.metadata.receiptUrl;
        link.download = `receipt-${donation.reference}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Generate new receipt
        const response = await fetch(`/api/donations/${donation.id}/receipt`, {
          method: "POST",
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `receipt-${donation.reference}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      }
      
      toast({
        title: "Receipt Downloaded",
        description: `Receipt for ${donation.reference} has been downloaded.`,
      });
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast({
        title: "Download Error",
        description: "Failed to download receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredDonations = filter === "all" 
    ? donations 
    : donations.filter(donation => donation.type.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Donations</p>
                  <p className="text-2xl font-bold">{stats.totalDonations}</p>
                </div>
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Given</p>
                  <p className="text-2xl font-bold">{formatAmount(stats.totalAmount, "NGN")}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Year</p>
                  <p className="text-2xl font-bold">{formatAmount(stats.currentYear, "NGN")}</p>
                  <p className="text-xs text-muted-foreground">
                    vs {formatAmount(stats.lastYear, "NGN")} last year
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View and manage your donation history and receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tithe">Tithe</TabsTrigger>
              <TabsTrigger value="offering">Offering</TabsTrigger>
              <TabsTrigger value="donation">Donation</TabsTrigger>
              <TabsTrigger value="project">Project</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-6">
              {filteredDonations.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No donations found
                  </h3>
                  <p className="text-muted-foreground">
                    {filter === "all" 
                      ? "You haven't made any donations yet." 
                      : `No ${filter} donations found.`}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDonations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{donation.reference}</div>
                              {donation.ministry && (
                                <div className="text-sm text-muted-foreground">
                                  {donation.ministry}
                                </div>
                              )}
                              {donation.isRecurring && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  {donation.frequency}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getTypeBadgeVariant(donation.type)}>
                              {donation.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatAmount(donation.amount, donation.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(donation.status)}>
                              {donation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{donation.paymentMethod}</span>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{format(new Date(donation.createdAt), "MMM d, yyyy")}</div>
                              <div className="text-muted-foreground">
                                {format(new Date(donation.createdAt), "h:mm a")}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => downloadReceipt(donation)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}