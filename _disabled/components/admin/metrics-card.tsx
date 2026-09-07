"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Headphones, 
  DollarSign, 
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: "users" | "sermons" | "donations" | "events";
}

const iconMap = {
  users: Users,
  sermons: Headphones,
  donations: DollarSign,
  events: Calendar,
};

export function MetricsCard({ title, value, change, trend, icon }: MetricsCardProps) {
  const Icon = iconMap[icon];
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <TrendIcon className={cn(
            "mr-1 h-3 w-3",
            trend === "up" ? "text-green-500" : "text-red-500"
          )} />
          <span className={cn(
            trend === "up" ? "text-green-500" : "text-red-500"
          )}>
            {change}
          </span>
          <span className="ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}