"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "default";
  
  // Define error messages for different error codes
  const errorMessages: Record<string, { title: string, description: string }> = {
    "default": {
      title: "Authentication Error",
      description: "An error occurred during authentication."
    },
    "session_expired": {
      title: "Session Expired",
      description: "Your session has expired. Please sign in again to continue."
    },
    "RefreshTokenExpired": {
      title: "Session Expired",
      description: "Your session has expired. Please sign in again to continue."
    },
    "AccessDenied": {
      title: "Access Denied",
      description: "You don't have permission to access this resource."
    },
    "CredentialsSignin": {
      title: "Invalid Credentials",
      description: "The email or password you entered is incorrect."
    },
    "OAuthAccountNotLinked": {
      title: "Account Not Linked",
      description: "To confirm your identity, sign in with the same account you used originally."
    },
    "missing_token": {
      title: "Missing Verification Token",
      description: "The verification link is invalid. Please request a new verification email."
    },
    "invalid_token": {
      title: "Invalid or Expired Token",
      description: "This verification link has expired or is invalid. Please request a new verification email."
    }
  };
  
  // Get the appropriate error message or use default
  const error = errorMessages[errorCode] || errorMessages.default;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">{error.title}</CardTitle>
          <CardDescription>
            {error.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>Please try again or contact support if the problem persists.</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/auth/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
