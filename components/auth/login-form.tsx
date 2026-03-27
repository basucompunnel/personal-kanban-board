"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authValidations } from "@/components/common/auth-schemas";
import { AuthErrorAlert } from "@/components/common/auth-error-alert";
import { useAuthSubmit } from "@/components/common/use-auth-submit";
import { AuthFormCard } from "@/components/common/auth-form-card";
import { AuthFormHeader } from "@/components/common/auth-form-header";
import { AuthFormField } from "@/components/common/auth-form-field";
import { AuthFormFooter } from "@/components/common/auth-form-footer";

const loginSchema = z.object({
  email: authValidations.email,
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { submit, error, isLoading } = useAuthSubmit("/api/auth/login");
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await submit(values);
  }

  return (
    <AuthFormCard>
      <AuthFormHeader
        title="Welcome Back"
        description="Login to your kanban board"
      />

      <AuthErrorAlert error={error} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AuthFormField
            control={form.control as any}
            name="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
            isLoading={isLoading}
          />

          <AuthFormField
            control={form.control as any}
            name="password"
            label="Password"
            placeholder="••••••"
            type="password"
            isLoading={isLoading}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <AuthFormFooter
        text="Don't have an account?"
        linkText="Register"
        linkHref="/auth/register"
      />
    </AuthFormCard>
  );
}
