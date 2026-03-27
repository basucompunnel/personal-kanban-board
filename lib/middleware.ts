import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function authMiddleware(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Add user info to request headers for later use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId as string);
    requestHeaders.set("x-user-email", payload.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized: Token verification failed" },
      { status: 401 }
    );
  }
}

export function getUserIdFromHeaders(headers: Headers): string | null {
  return headers.get("x-user-id");
}

export function getUserEmailFromHeaders(headers: Headers): string | null {
  return headers.get("x-user-email");
}
