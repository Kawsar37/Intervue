"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth/client";
import { authClient } from "@/lib/auth/client";
import { setCurrentUserId } from "@/lib/api";

export function useAuth() {
  const { data: session, isPending, error } = useSession();
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  // Get JWT token when session loads
  useEffect(() => {
    if (session?.user) {
      setCurrentUserId(session.user.id);
      // Fetch JWT token for cross-origin API calls
      authClient.token().then(({ data }) => {
        if (data?.token) {
          setJwtToken(data.token);
          localStorage.setItem("jwt_token", data.token);
        }
      }).catch(() => {});
    } else {
      setCurrentUserId(null);
      setJwtToken(null);
      localStorage.removeItem("jwt_token");
    }
  }, [session?.user]);

  return {
    user: session?.user || null,
    session: session?.session || null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    jwtToken,
    error,
    signOut: async () => {
      await signOut();
      setCurrentUserId(null);
      localStorage.removeItem("jwt_token");
      window.location.href = "/";
    },
  };
}
