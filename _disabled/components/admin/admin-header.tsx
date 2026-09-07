"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, LogOut, User, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarItems } from "./sidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const filteredItems = sidebarItems.filter(item =>
    item.roles.includes(user?.role || "")
  );

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center border-b px-6">
              <span className="font-semibold text-lg">Halleluyah House Admin</span>
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
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold hidden md:block">Admin Panel</h1>
        <h1 className="text-lg font-semibold md:hidden">Admin</h1>
        <Badge variant="outline" className="text-xs hidden sm:inline-flex">
          {user?.role}
        </Badge>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Actions */}
        <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            View Site
          </Link>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                <AvatarFallback>
                  {user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-sm">
                <span className="font-medium">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}