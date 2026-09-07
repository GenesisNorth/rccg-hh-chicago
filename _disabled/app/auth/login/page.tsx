import { redirect } from "next/navigation";

// Canonical sign-in page is /auth/signin (see FIX_TRACKER.md 4.1)
export default function LoginPage() {
  redirect("/auth/signin");
}
