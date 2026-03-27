"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * AuthGuard wrapper component
 * Redirects to home if user is already authenticated
 * Used to prevent authenticated users from accessing auth pages (login, register)
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth context to hydrate from localStorage
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show content only if not authenticated
  if (user) {
    return null;
  }

  return <>{children}</>;
}
