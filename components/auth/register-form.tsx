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

const registerSchema = z
  .object({
    fullName: authValidations.fullName,
    email: authValidations.email,
    password: authValidations.password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { submit, error, isLoading } = useAuthSubmit("/api/auth/register");
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    await submit(values);
  }

  return (
    <AuthFormCard>
      <AuthFormHeader
        title="Create Account"
        description="Register to get started with your kanban board"
      />

      <AuthErrorAlert error={error} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AuthFormField
            control={form.control as any}
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            type="text"
            isLoading={isLoading}
          />

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

          <AuthFormField
            control={form.control as any}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••"
            type="password"
            isLoading={isLoading}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-sm"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </Form>

      <AuthFormFooter
        text="Already have an account?"
        linkText="Login"
        linkHref="/auth/login"
      />
    </AuthFormCard>
  );
}
