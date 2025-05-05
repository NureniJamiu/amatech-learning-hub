import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/utils/hash";
import { generateAuthToken } from "@/utils/token";

export async function POST(req: NextRequest) {
  try {
    const { firstname, lastname, email, password, level } = await req.json();

    if (!firstname || !lastname || !email || !password || !level) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (firstname.length < 3) {
      return NextResponse.json(
        { message: "Firstname must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (lastname.length < 3) {
      return NextResponse.json(
        { message: "Lastname must be at least 3 characters" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        level: Number.parseInt(level),
        email,
        currentSemester: 1,
        department: "Management Technology",
        faculty: "Management Sciences",
        password: hashedPassword,
      },
    });

    const token = generateAuthToken(user.id);

    return NextResponse.json(
      {
        token,
        message: "User registered successfully",
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to register user" },
      { status: 500 }
    );
  }
}
