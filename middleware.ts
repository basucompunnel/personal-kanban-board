import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Auth is now handled client-side via localStorage
  // All routes are accessible; client-side auth context will redirect unauthorized users
  return NextResponse.next();
}

export const config = {
  matcher: ["/boards/:path*", "/api/boards/:path*", "/auth/:path*", "/"],
};
