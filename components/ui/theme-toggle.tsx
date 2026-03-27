"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline" size="icon" disabled />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-xs" variant="outline" size="icon">
          {theme === "light" ? (
            <Sun className="h-4 w-4" />
          ) : theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Monitor className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xs" align="end">
        <DropdownMenuCheckboxItem
          className="rounded-xs"
          checked={theme === "light"}
          onCheckedChange={() => setTheme("light")}
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="rounded-xs"
          checked={theme === "dark"}
          onCheckedChange={() => setTheme("dark")}
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="rounded-xs"
          checked={theme === "system"}
          onCheckedChange={() => setTheme("system")}
        >
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
