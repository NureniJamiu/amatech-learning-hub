import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { generateAuthToken } from "@/lib/token";

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
        level,
        email,
        password: hashedPassword,
      },
    });

    const token = generateAuthToken(user.id);

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          level: user.level,
          role: user.role,
          // bio: user.bio,
          // profileImg: user.profileImg,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
