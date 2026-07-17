"use client";

import { useSession, signOut } from "@/lib/auth/client";

export function useAuth() {
  const { data: session, isPending, error } = useSession();

  return {
    user: session?.user || null,
    session: session?.session || null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    error,
    signOut: async () => {
      await signOut();
      window.location.href = "/";
    },
  };
}
