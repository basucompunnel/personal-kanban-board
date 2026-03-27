"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GuestRoute } from "@/components/common/guest-route";

export function Home() {
  const router = useRouter();

  return (
    <GuestRoute>
      <div className="flex flex-col items-center justify-center flex-1 gap-6 p-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Personal Kanban Board</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Organize your tasks with an intuitive kanban board. Stay productive
            and focused.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            className="rounded-sm"
            size="lg"
            onClick={() => router.push("/auth/login")}
          >
            Sign In
          </Button>
          <Button
            className="rounded-sm"
            size="lg"
            variant="outline"
            onClick={() => router.push("/auth/register")}
          >
            Create Account
          </Button>
        </div>
      </div>
    </GuestRoute>
  );
}
