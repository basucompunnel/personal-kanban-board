import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between h-16 px-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold">Personal Kanban Board</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
