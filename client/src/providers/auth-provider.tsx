"use client";

// Better Auth v2 uses nanostores instead of React Context
// No SessionProvider needed - useSession works directly
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
