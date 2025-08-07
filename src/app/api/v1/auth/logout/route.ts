import { NextResponse } from "next/server";

export async function POST() {
  console.log("Logout route hit");
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear the HTTP-only cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Immediately expire the cookie
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
