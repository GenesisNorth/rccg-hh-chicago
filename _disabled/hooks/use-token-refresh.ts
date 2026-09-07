"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Custom hook to handle Firebase auth token refresh
 * Firebase handles token refresh automatically, so this is mainly for compatibility
 */
export function useTokenRefresh() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Firebase handles token refresh automatically
    // If user becomes null unexpectedly, they may need to re-authenticate
    if (!loading && !user) {
      router.push("/auth/signin?error=session_expired");
    }
  }, [user, loading, router]);

  return { user, loading };
}

/**
 * Firebase token refresh hook - mainly for compatibility
 * Firebase handles token expiry and refresh automatically
 * @param expiryThresholdMinutes - Not used in Firebase implementation
 */
export function useSessionRefresh(expiryThresholdMinutes = 5) {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // Firebase automatically refreshes tokens when needed
    // This hook is kept for API compatibility but doesn't need to do anything
    console.log("Firebase handles token refresh automatically");
  }, [user, loading, expiryThresholdMinutes]);
  
  return { user, loading };
}
