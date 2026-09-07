"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Image,
  DollarSign,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Book,
  Headphones,
  UserCheck,
  Bell,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["SUPERADMIN", "ADMIN", "PASTOR"],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["SUPERADMIN", "ADMIN"],
  },
  {
    title: "Sermons",
    href: "/admin/sermons",
    icon: Headphones,
    roles: ["SUPERADMIN", "ADMIN", "PASTOR"],
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
    roles: ["SUPERADMIN", "ADMIN", "PASTOR"],
  },
  {
    title: "Media Library",
    href: "/admin/media",
    icon: Image,
    roles: ["SUPERADMIN", "ADMIN", "PASTOR"],
  },
  {
    title: "Donations",
    href: "/admin/donations",
    icon: DollarSign,
    roles: ["SUPERADMIN", "ADMIN", "PASTOR"],
  },
  {
    title: "Devotionals",
    href: "/admin/devotionals",
    icon: Book,
    roles: ["SUPERADMIN", "ADMIN", "PASTOR"],
  },
  {
    title: "Workers",
    href: "/admin/workers",
    icon: UserCheck,
    roles: ["SUPERADMIN", "ADMIN", "PASTOR"],
  },
  {
    title: "Communications",
    href: "/admin/communications",
    icon: MessageSquare,
    roles: ["SUPERADMIN", "ADMIN", "PASTOR"],
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    roles: ["SUPERADMIN", "ADMIN", "PASTOR"],
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    roles: ["SUPERADMIN", "ADMIN", "PASTOR"],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["SUPERADMIN", "ADMIN"],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredItems = sidebarItems.filter(item =>
    item.roles.includes(user?.role || "")
  );

  return (
    <div className={cn(
      "flex flex-col border-r bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span className="font-semibold">Halleluyah House Admin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}