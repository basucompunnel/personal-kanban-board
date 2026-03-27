"use client";

import { LoginForm } from "@/components/auth/login-form";
import { AuthGuard } from "@/components/common/auth-guard";

export default function LoginPage() {
  return (
    <AuthGuard>
      <div className="flex flex-1 items-center justify-center bg-background">
        <LoginForm />
      </div>
    </AuthGuard>
  );
}
