"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuth, saveAuth, clearAuth } from "./storage";

export interface AuthContextType {
  user: { id: string; fullName: string; email: string } | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (token: string, user: { id: string; fullName: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; fullName: string; email: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setToken(auth.token);
      setUser(auth.user);
    }
    setIsLoading(false);
  }, []);

  const handleSetAuth = (newToken: string, newUser: { id: string; fullName: string; email: string }) => {
    setToken(newToken);
    setUser(newUser);
    saveAuth({ token: newToken, user: newUser });
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        setAuth: handleSetAuth,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
