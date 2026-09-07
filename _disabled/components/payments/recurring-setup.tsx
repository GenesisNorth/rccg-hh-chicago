"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  RefreshCw,
  Calendar,
  DollarSign,
  Settings,
  Pause,
  Play,
  Trash2,
  Edit,
  Plus,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

interface RecurringDonation {
  id: string;
  type: "TITHE" | "OFFERING" | "DONATION" | "PROJECT";
  ministry?: string;
  amount: number;
  currency: string;
  frequency: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  paymentMethod: "PAYSTACK" | "STRIPE";
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  nextPaymentDate: string;
  startDate: string;
  totalPayments: number;
  totalAmount: number;
  lastPaymentDate?: string;
}

interface RecurringSetupProps {
  initialAmount?: number;
  initialType?: string;
  initialMinistry?: string;
  onSetupComplete?: (recurring: RecurringDonation) => void;
}

export function RecurringSetup({
  initialAmount = 0,
  initialType = "tithe",
  initialMinistry,
  onSetupComplete,
}: RecurringSetupProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recurringDonations, setRecurringDonations] = useState<RecurringDonation[]>([]);
  const [loading, setLoading] = useState(false);
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<RecurringDonation | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: initialType,
    ministry: initialMinistry || "",
    amount: initialAmount.toString(),
    currency: "NGN",
    frequency: "MONTHLY",
    paymentMethod: "PAYSTACK",
    startDate: format(new Date(), "yyyy-MM-dd"),
  });

  const givingTypes = [
    { value: "TITHE", label: "Tithe" },
    { value: "OFFERING", label: "Offering" },
    { value: "DONATION", label: "Donation" },
    { value: "PROJECT", label: "Building Project" },
  ];

  const frequencies = [
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "QUARTERLY", label: "Quarterly" },
    { value: "YEARLY", label: "Yearly" },
  ];

  const ministries = [
    { value: "youth", label: "Youth Ministry" },
    { value: "children", label: "Children's Ministry" },
    { value: "women", label: "Women's Ministry" },
    { value: "men", label: "Men's Ministry" },
    { value: "outreach", label: "Outreach & Missions" },
    { value: "worship", label: "Worship Ministry" },
  ];

  const handleSetupRecurring = async () => {
    try {
      setLoading(true);

      const recurringData = {
        ...formData,
        amount: parseFloat(formData.amount),
        userId: user?.id,
      };

      const response = await fetch("/api/donations/recurring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recurringData),
      });

      if (response.ok) {
        const newRecurring = await response.json();
        setRecurringDonations([...recurringDonations, newRecurring]);
        
        toast({
          title: "Recurring Donation Set Up",
          description: `Your ${formData.frequency.toLowerCase()} ${formData.type.toLowerCase()} has been set up successfully.`,
        });

        if (onSetupComplete) {
          onSetupComplete(newRecurring);
        }

        setSetupDialogOpen(false);
        resetForm();
      } else {
        throw new Error("Failed to set up recurring donation");
      }
    } catch (error) {
      console.error("Error setting up recurring donation:", error);
      toast({
        title: "Setup Error",
        description: "Failed to set up recurring donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (donation: RecurringDonation) => {
    try {
      const newStatus = donation.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
      
      const response = await fetch(`/api/donations/recurring/${donation.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRecurringDonations(donations =>
          donations.map(d =>
            d.id === donation.id ? { ...d, status: newStatus } : d
          )
        );

        toast({
          title: "Status Updated",
          description: `Recurring donation ${newStatus.toLowerCase()}.`,
        });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Error",
        description: "Failed to update recurring donation status.",
        variant: "destructive",
      });
    }
  };

  const handleCancelRecurring = async (donation: RecurringDonation) => {
    try {
      const response = await fetch(`/api/donations/recurring/${donation.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRecurringDonations(donations =>
          donations.filter(d => d.id !== donation.id)
        );

        toast({
          title: "Recurring Donation Cancelled",
          description: "Your recurring donation has been cancelled.",
        });
      } else {
        throw new Error("Failed to cancel recurring donation");
      }
    } catch (error) {
      console.error("Error cancelling recurring donation:", error);
      toast({
        title: "Cancellation Error",
        description: "Failed to cancel recurring donation.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      type: initialType,
      ministry: initialMinistry || "",
      amount: initialAmount.toString(),
      currency: "NGN",
      frequency: "MONTHLY",
      paymentMethod: "PAYSTACK",
      startDate: format(new Date(), "yyyy-MM-dd"),
    });
    setEditingDonation(null);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "PAUSED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currency === "NGN" ? "₦" : currency === "USD" ? "$" : "£";
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Setup Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Recurring Donations
          </CardTitle>
          <CardDescription>
            Set up automatic recurring donations for consistent giving
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Set Up Recurring Donation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingDonation ? "Edit Recurring Donation" : "Set Up Recurring Donation"}
                </DialogTitle>
                <DialogDescription>
                  Configure your automatic recurring donation settings
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Giving Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Giving Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select giving type" />
                    </SelectTrigger>
                    <SelectContent>
                      {givingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ministry (conditional) */}
                {formData.type === "DONATION" && (
                  <div className="space-y-2">
                    <Label htmlFor="ministry">Ministry (Optional)</Label>
                    <Select
                      value={formData.ministry}
                      onValueChange={(value) => setFormData({ ...formData, ministry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ministry" />
                      </SelectTrigger>
                      <SelectContent>
                        {ministries.map((ministry) => (
                          <SelectItem key={ministry.value} value={ministry.value}>
                            {ministry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Frequency */}
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAYSTACK">Paystack</SelectItem>
                      <SelectItem value="STRIPE">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSetupDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSetupRecurring} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting Up...
                    </>
                  ) : (
                    "Set Up Recurring Donation"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Active Recurring Donations */}
      {recurringDonations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Recurring Donations</CardTitle>
            <CardDescription>
              Manage your active recurring donation settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recurringDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{donation.type}</h4>
                      {donation.ministry && (
                        <Badge variant="outline" className="text-xs">
                          {donation.ministry}
                        </Badge>
                      )}
                      <Badge variant={getStatusBadgeVariant(donation.status)}>
                        {donation.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatAmount(donation.amount, donation.currency)} • {donation.frequency.toLowerCase()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Next payment: {format(new Date(donation.nextPaymentDate), "PPP")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {donation.totalPayments} payments • {formatAmount(donation.totalAmount, donation.currency)} total
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(donation)}
                    >
                      {donation.status === "ACTIVE" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingDonation(donation);
                        setFormData({
                          type: donation.type,
                          ministry: donation.ministry || "",
                          amount: donation.amount.toString(),
                          currency: donation.currency,
                          frequency: donation.frequency,
                          paymentMethod: donation.paymentMethod,
                          startDate: donation.startDate,
                        });
                        setSetupDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelRecurring(donation)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}