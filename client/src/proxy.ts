import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  // const session = await auth.api.getSession({
  //   query: {
  //     disableCookieCache: true,
  //   },
  //   headers: await headers(),
  // });
  // if (!session) return NextResponse.redirect(new URL("/login", request.url));
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
