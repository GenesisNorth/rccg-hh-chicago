"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { friendlyAuthError } from "@/lib/auth-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Firebase email action handler.
 * Set this page as the custom action URL in Firebase Console →
 * Authentication → Templates ("%LINK%" → https://<domain>/auth/action).
 * Handles mode=resetPassword and mode=verifyEmail with the oobCode param.
 */
function AuthActionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState<"working" | "reset-form" | "done" | "error">("working");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!mode || !oobCode) {
        setErrorMessage("This link is invalid or incomplete. Please request a new one.");
        setStatus("error");
        return;
      }

      try {
        if (mode === "verifyEmail") {
          await applyActionCode(auth, oobCode);
          // AuthContext syncs the Firestore emailVerified flag on next load
          await auth.currentUser?.reload();
          setStatus("done");
          router.push("/auth/verify-success");
        } else if (mode === "resetPassword") {
          const accountEmail = await verifyPasswordResetCode(auth, oobCode);
          setEmail(accountEmail);
          setStatus("reset-form");
        } else {
          setErrorMessage("This link type isn't supported.");
          setStatus("error");
        }
      } catch (error) {
        setErrorMessage(friendlyAuthError(error, "This link is invalid or has expired."));
        setStatus("error");
      }
    };

    run();
  }, [mode, oobCode, router]);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please re-enter your new password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await confirmPasswordReset(auth, oobCode!, password);
      toast({
        title: "Password updated",
        description: "You can now sign in with your new password.",
      });
      router.push("/auth/signin");
    } catch (error) {
      toast({
        title: "Error",
        description: friendlyAuthError(error, "Failed to reset password."),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "working" || status === "done") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Link Problem</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/auth/forgot-password">Request New Link</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <CardDescription>
            {email ? `Resetting the password for ${email}` : "Choose a new password"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleResetSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthActionContent />
    </Suspense>
  );
}
