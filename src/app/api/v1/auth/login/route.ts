import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePasswords } from "@/utils/hash";
import { generateAuthToken } from "@/utils/token";

export async function POST(req: NextRequest) {
  console.log("Login route hit");
  try {
    const { email, password } = await req.json();
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("User found:", !!user);

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isValid = await comparePasswords(password, user.password);
    console.log("Password valid:", isValid);

    if (!isValid) {
      console.log("Invalid password");
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = generateAuthToken(user.id);
    console.log("Token generated successfully");

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        matricNumber: user.matricNumber,
        level: user.level,
        isAdmin: user.isAdmin,
        department: user.department,
        faculty: user.faculty,
        currentSemester: user.currentSemester,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
