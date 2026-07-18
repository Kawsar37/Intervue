import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { headers } from "next/headers";
import { authClient } from "./lib/auth/client";

export async function proxy(request: NextRequest) {
  const { data: session } = await authClient.getSession({
    query: {
      disableCookieCache: true,
    },
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/interviews/:path*",
    "/resumes/:path*",
    "/favorites/:path*",
    "/templates/manage/:path*",
    "/templates/new/:path*",
  ],
};
