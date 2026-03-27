"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function BoardsContent() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout(); // Clear localStorage and auth context
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 p-6">
      <h1 className="text-3xl font-bold">Your Kanban Boards</h1>
      <p className="text-muted-foreground">More content coming soon...</p>

      <Button
        className="rounded-xs"
        onClick={handleLogout}
        disabled={isLoading}
        variant="outline"
      >
        {isLoading ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
