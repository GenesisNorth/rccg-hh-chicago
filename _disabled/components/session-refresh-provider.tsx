"use client";

import React from "react";
import { useTokenRefresh, useSessionRefresh } from "@/hooks/use-token-refresh";

export function SessionRefreshProvider({ children }: { children: React.ReactNode }) {
  // Use our custom hooks to handle token refresh
  useTokenRefresh();
  useSessionRefresh();
  
  return <>{children}</>;
}
