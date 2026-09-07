"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function VerifySuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Email Verified!</CardTitle>
          <CardDescription>
            Thank you for verifying your email address. Your account is now fully activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>You can now access all features of our church platform.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
