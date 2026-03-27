"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function useAuthSubmit(endpoint: string) {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submit(data: Record<string, any>) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseData = await response.json();
        setError(responseData.error || "Request failed");
        return false;
      }

      const responseData = await response.json();

      // Save auth to context and localStorage
      if (responseData.token && responseData.user) {
        setAuth(responseData.token, responseData.user);
      }

      // Success - redirect to boards
      router.push("/boards");
      return true;
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { submit, error, isLoading };
}
