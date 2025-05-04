import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { authenticateRequest } from "@/middleware/auth.middleware";

export async function GET(req: NextRequest) {
  try {
    const authUser = authenticateRequest(req);

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level");

    const userId = authUser?.userId || searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let whereCondition = {};

    if (level === "All") {
      whereCondition = {};
    } else if (level && level !== "All") {
      whereCondition = { level };
    } else {
      whereCondition = { level: user.level };
    }

    const courses = await prisma.course.findMany({
      where: whereCondition,
      orderBy: { courseCode: "asc" },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("[GET COURSES]", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = authenticateRequest(req);

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("User ID from token:", authUser?.userId);
    const { courseCode, courseTitle, level, description } = await req.json();

    if (!courseCode || !courseTitle || !level) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCourse = await prisma.course.create({
      data: {
        courseCode,
        courseTitle,
        level,
        description,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("[CREATE COURSE]", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

// EXAMPLE USAGE
// This is how you would call the API from a client-side component or page
// const fetchCourses = async (userId: string, level?: string) => {
//     const params = new URLSearchParams({ userId });
//     if (level) params.append("level", level);

//     const res = await fetch(`/api/courses?${params.toString()}`);
//     const data = await res.json();
//     return data;
//   };
