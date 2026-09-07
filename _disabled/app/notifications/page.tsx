"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useUserNotifications } from "@/hooks/useFirestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { convertTimestampToDate } from "@/lib/firestore-utils";
import Link from "next/link";

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data: notifications, loading } = useUserNotifications(user?.id || null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin?redirect=/notifications");
    }
  }, [user, authLoading, router]);

  const markRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (error) {
      console.error("Error marking notification read:", error);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => markRead(n.id)));
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No notifications yet</h3>
            <p className="text-sm text-muted-foreground">
              Announcements, events, and updates from the church will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? "" : "border-primary/40 bg-primary/5"}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{notification.title}</p>
                      {!notification.read && <Badge variant="secondary">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(convertTimestampToDate(notification.createdAt), { addSuffix: true })}
                    </p>
                    {notification.actionUrl && (
                      <Button variant="link" size="sm" className="px-0" asChild>
                        <Link href={notification.actionUrl}>View details</Link>
                      </Button>
                    )}
                  </div>
                  {!notification.read && (
                    <Button variant="ghost" size="sm" onClick={() => markRead(notification.id)}>
                      Mark read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
