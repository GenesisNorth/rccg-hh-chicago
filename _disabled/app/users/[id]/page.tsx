"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { UserProfileView } from "@/components/user-profile-view";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function UserPage() {
  const params = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const userId = params.id;
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    router.push("/auth/signin");
    return null;
  }
  
  return (
    <div className="container max-w-5xl py-8 space-y-4">
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <UserProfileView userId={userId} />
    </div>
  );
}
