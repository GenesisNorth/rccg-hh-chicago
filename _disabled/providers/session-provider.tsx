"use client";

import { AuthProvider } from "@/contexts/AuthContext";

// Updated to use Firebase Auth instead of NextAuth
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
