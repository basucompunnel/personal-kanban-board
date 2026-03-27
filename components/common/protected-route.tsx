"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * ProtectedRoute wrapper component
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth context to hydrate from localStorage
    if (!isLoading && !token) {
      router.push("/auth/login");
    }
  }, [token, isLoading, router]);

  // Show nothing while loading to prevent flash of content
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Show content only if authenticated
  if (!token) {
    return null;
  }

  return <>{children}</>;
}
