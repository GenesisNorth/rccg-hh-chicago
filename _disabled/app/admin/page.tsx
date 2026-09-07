"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsCard } from "@/components/admin/metrics-card";
import { QuickActions } from "@/components/admin/quick-actions";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { OverviewChart } from "@/components/admin/overview-chart";
import { RecentUsers } from "@/components/admin/recent-users";
import { RecentDonations } from "@/components/admin/recent-donations";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface DashboardData {
  metrics: {
    totalUsers: number;
    totalSermons: number;
    totalDonations: number;
    totalEvents: number;
    monthlyGrowth: {
      users: number;
      sermons: number;
      donations: number;
      events: number;
    };
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    user?: {
      name: string;
      image?: string;
    };
  }>;
  chartData: Array<{
    name: string;
    users: number;
    sermons: number;
    donations: number;
  }>;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // In a real app, this would be a single API call
        const [metricsResponse, activityResponse, chartResponse] = await Promise.all([
          fetch("/api/admin/metrics"),
          fetch("/api/admin/activity"),
          fetch("/api/admin/charts"),
        ]);

        if (!metricsResponse.ok || !activityResponse.ok || !chartResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [metrics, recentActivity, chartData] = await Promise.all([
          metricsResponse.json(),
          activityResponse.json(),
          chartResponse.json(),
        ]);

        setData({
          metrics,
          recentActivity,
          chartData,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        toast({
          title: "Error",
          description: "Failed to fetch dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's what's happening at Halleluyah House.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            View Analytics
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Members"
          value={data.metrics.totalUsers.toLocaleString()}
          change={`+${data.metrics.monthlyGrowth.users}%`}
          trend="up"
          icon="users"
        />
        <MetricsCard
          title="Total Sermons"
          value={data.metrics.totalSermons.toString()}
          change={`+${data.metrics.monthlyGrowth.sermons}%`}
          trend="up"
          icon="sermons"
        />
        <MetricsCard
          title="Total Giving"
          value={`₦${(data.metrics.totalDonations / 1000).toFixed(0)}K`}
          change={`+${data.metrics.monthlyGrowth.donations}%`}
          trend="up"
          icon="donations"
        />
        <MetricsCard
          title="Active Events"
          value={data.metrics.totalEvents.toString()}
          change={`+${data.metrics.monthlyGrowth.events}%`}
          trend="up"
          icon="events"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Charts and Analytics */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Monthly metrics for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OverviewChart data={data.chartData} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
      </div>

      {/* Secondary Content */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="users">New Users</TabsTrigger>
          <TabsTrigger value="donations">Recent Donations</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <ActivityFeed activities={data.recentActivity} />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <RecentUsers />
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <RecentDonations />
        </TabsContent>
      </Tabs>
    </div>
  );
}