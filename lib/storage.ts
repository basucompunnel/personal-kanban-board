/**
 * Client-side localStorage helpers for authentication persistence
 */

export interface AuthData {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

const AUTH_KEY = "auth";

/**
 * Save auth data to localStorage
 */
export function saveAuth(data: AuthData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  }
}

/**
 * Get auth data from localStorage
 */
export function getAuth(): AuthData | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to parse auth data from localStorage:", error);
    return null;
  }
}

/**
 * Clear auth data from localStorage
 */
export function clearAuth(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}

/**
 * Check if auth data exists in localStorage
 */
export function hasAuth(): boolean {
  return getAuth() !== null;
}
