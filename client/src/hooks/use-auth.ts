"use client";

import { useEffect } from "react";
import { useSession, signOut } from "@/lib/auth/client";
import { setCurrentUserId } from "@/lib/api";

export function useAuth() {
  const { data: session, isPending, error } = useSession();

  useEffect(() => {
    setCurrentUserId(session?.user?.id || null);
  }, [session?.user?.id]);

  return {
    user: session?.user || null,
    session: session?.session || null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    error,
    signOut: async () => {
      await signOut();
      setCurrentUserId(null);
      window.location.href = "/";
    },
  };
}
