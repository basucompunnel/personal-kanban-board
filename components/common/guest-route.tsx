"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface GuestRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * GuestRoute wrapper component
 * Redirects authenticated users away from pages that are for guests/non-authenticated users
 * If authenticated, redirects to the specified destination (default: /boards)
 */
export function GuestRoute({ children, redirectTo = "/boards" }: GuestRouteProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth context to hydrate from localStorage
    if (!isLoading && user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

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
