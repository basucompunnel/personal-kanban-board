import { NextRequest, NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Remove auth cookie
    await removeAuthCookie();

    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
