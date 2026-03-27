"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "../ui/theme-toggle";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between h-16 px-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold">Personal Kanban Board</h1>

        <div className="flex items-center gap-6">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xs">
                  {user.fullName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xs" align="end">
                <DropdownMenuItem className="rounded-xs" onClick={handleLogout} variant="destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
