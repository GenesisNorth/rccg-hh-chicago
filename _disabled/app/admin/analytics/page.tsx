"use client";

import { useEffect, useState } from "react";
import { MetricsCard } from "@/components/admin/metrics-card";
import { OverviewChart } from "@/components/admin/overview-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Metrics {
  totalUsers: number;
  totalSermons: number;
  totalDonations: number;
  totalEvents: number;
  monthlyGrowth: { users: number; sermons: number; donations: number; events: number };
}

export default function AdminAnalyticsPage() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [metricsRes, chartsRes] = await Promise.all([
          fetch("/api/admin/metrics"),
          fetch("/api/admin/charts"),
        ]);
        if (metricsRes.ok) setMetrics(await metricsRes.json());
        if (chartsRes.ok) setChartData(await chartsRes.json());
        if (!metricsRes.ok || !chartsRes.ok) {
          toast({ title: "Error", description: "Failed to load some analytics data", variant: "destructive" });
        }
      } catch (error) {
        console.error("Error loading analytics:", error);
        toast({ title: "Error", description: "Failed to load analytics", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Growth and activity across the last six months</p>
      </div>

      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Members"
            value={String(metrics.totalUsers)}
            change={`${metrics.monthlyGrowth.users}% joined in last 30 days`}
            trend={metrics.monthlyGrowth.users >= 0 ? "up" : "down"}
            icon="users"
          />
          <MetricsCard
            title="Total Giving"
            value={`₦${metrics.totalDonations.toLocaleString()}`}
            change={`${metrics.monthlyGrowth.donations}% in last 30 days`}
            trend={metrics.monthlyGrowth.donations >= 0 ? "up" : "down"}
            icon="donations"
          />
          <MetricsCard
            title="Sermons"
            value={String(metrics.totalSermons)}
            change={`${metrics.monthlyGrowth.sermons}% in last 30 days`}
            trend={metrics.monthlyGrowth.sermons >= 0 ? "up" : "down"}
            icon="sermons"
          />
          <MetricsCard
            title="Events"
            value={String(metrics.totalEvents)}
            change={`${metrics.monthlyGrowth.events}% in last 30 days`}
            trend={metrics.monthlyGrowth.events >= 0 ? "up" : "down"}
            icon="events"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Six-Month Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <OverviewChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
