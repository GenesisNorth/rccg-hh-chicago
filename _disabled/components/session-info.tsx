"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function SessionInfo() {
  const { user } = useAuth();
  const [expiresIn, setExpiresIn] = useState<string | null>(null);
  
  useEffect(() => {
    // Firebase tokens handle expiry automatically, so this component may not be needed
    // Keeping for compatibility but session expiry is managed by Firebase
    return;
    
    // Firebase handles token refresh automatically
  }, [user]);
  
  if (!user) return null;
  
  // Firebase handles token expiry automatically, so no manual session warning needed
  return null;
}
