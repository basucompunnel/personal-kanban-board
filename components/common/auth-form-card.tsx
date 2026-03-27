import React from "react";

interface AuthFormCardProps {
  children: React.ReactNode;
}

export function AuthFormCard({ children }: AuthFormCardProps) {
  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-card rounded-sm border border-border shadow-sm">
      {children}
    </div>
  );
}
