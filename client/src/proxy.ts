import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
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
