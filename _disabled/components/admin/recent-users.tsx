"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, User, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  emailVerified: boolean;
}

export function RecentUsers() {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await fetch("/api/admin/users/recent?limit=5");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          // Mock data for demo
          setUsers([
            {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              image: null,
              role: "MEMBER",
              createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              emailVerified: true,
            },
            {
              id: "2",
              name: "Jane Smith",
              email: "jane@example.com",
              image: null,
              role: "LEADER",
              createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
              emailVerified: false,
            },
            {
              id: "3",
              name: "Mike Johnson",
              email: "mike@example.com",
              image: null,
              role: "MEMBER",
              createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
              emailVerified: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching recent users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "destructive";
      case "ADMIN":
        return "default";
      case "PASTOR":
        return "secondary";
      case "LEADER":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>
            New members who recently joined
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/users">
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
        ) : users.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No recent users to display
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>
                      {user.name ? user.name[0].toUpperCase() : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name || "Unnamed User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                    {user.role}
                  </Badge>
                  {!user.emailVerified && (
                    <Badge variant="outline" className="text-xs">
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}