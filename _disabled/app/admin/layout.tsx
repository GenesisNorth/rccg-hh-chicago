"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessAdminPanel } from "@/lib/roles";
import { Sidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || !canAccessAdminPanel(user.role))) {
      router.push("/dashboard");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
    }
  }, [user, loading, router, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !canAccessAdminPanel(user.role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}