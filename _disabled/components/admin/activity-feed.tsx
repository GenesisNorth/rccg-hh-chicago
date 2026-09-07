"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Headphones, 
  DollarSign, 
  Calendar,
  Bell,
  FileText,
  Image,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  user?: {
    name: string;
    image?: string;
  };
}

interface ActivityFeedProps {
  activities: Activity[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "user_registered":
      return UserPlus;
    case "sermon_uploaded":
      return Headphones;
    case "donation_received":
      return DollarSign;
    case "event_created":
      return Calendar;
    case "announcement_sent":
      return Bell;
    case "devotional_published":
      return FileText;
    case "media_uploaded":
      return Image;
    default:
      return Bell;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "user_registered":
      return "bg-green-100 text-green-600";
    case "sermon_uploaded":
      return "bg-blue-100 text-blue-600";
    case "donation_received":
      return "bg-yellow-100 text-yellow-600";
    case "event_created":
      return "bg-purple-100 text-purple-600";
    case "announcement_sent":
      return "bg-orange-100 text-orange-600";
    case "devotional_published":
      return "bg-indigo-100 text-indigo-600";
    case "media_uploaded":
      return "bg-pink-100 text-pink-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getActivityBadge = (type: string) => {
  switch (type) {
    case "user_registered":
      return { text: "New User", variant: "secondary" as const };
    case "sermon_uploaded":
      return { text: "Sermon", variant: "default" as const };
    case "donation_received":
      return { text: "Donation", variant: "secondary" as const };
    case "event_created":
      return { text: "Event", variant: "outline" as const };
    case "announcement_sent":
      return { text: "Announcement", variant: "destructive" as const };
    case "devotional_published":
      return { text: "Devotional", variant: "secondary" as const };
    case "media_uploaded":
      return { text: "Media", variant: "outline" as const };
    default:
      return { text: "Activity", variant: "outline" as const };
  }
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions and updates across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No recent activity to display
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const iconColor = getActivityColor(activity.type);
              const badge = getActivityBadge(activity.type);

              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <Badge variant={badge.variant} className="ml-2">
                        {badge.text}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      {activity.user && (
                        <>
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={activity.user.image} alt={activity.user.name} />
                            <AvatarFallback>
                              {activity.user.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{activity.user.name}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}