"use client";

import { RegisterForm } from "@/components/auth/register-form";
import { AuthGuard } from "@/components/common/auth-guard";

export default function RegisterPage() {
  return (
    <AuthGuard>
      <div className="flex flex-1 items-center justify-center bg-background">
        <RegisterForm />
      </div>
    </AuthGuard>
  );
}
