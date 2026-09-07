"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calendar, 
  Upload, 
  Users, 
  Mail,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Add New Sermon",
    description: "Upload a new sermon with audio/video",
    icon: Plus,
    href: "/admin/sermons/create",
    color: "bg-blue-500",
  },
  {
    title: "Create Event",
    description: "Schedule a new church event",
    icon: Calendar,
    href: "/admin/events/create",
    color: "bg-green-500",
  },
  {
    title: "Upload Media",
    description: "Add photos or videos to gallery",
    icon: Upload,
    href: "/admin/media/upload",
    color: "bg-purple-500",
  },
  {
    title: "Manage Users",
    description: "View and manage member accounts",
    icon: Users,
    href: "/admin/users",
    color: "bg-orange-500",
  },
  {
    title: "Send Announcement",
    description: "Broadcast message to all members",
    icon: Mail,
    href: "/admin/communications/announce",
    color: "bg-pink-500",
  },
  {
    title: "View Analytics",
    description: "Check detailed reports and insights",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "bg-indigo-500",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-accent"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color} text-white mr-3`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}