import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/middleware/auth.middleware";
import { isAdminUser } from "@/helpers";

// GET /api/courses - Get all courses with optional filtering
export async function GET(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level")
      ? Number.parseInt(searchParams.get("level")!)
      : undefined;
    const semester = searchParams.get("semester")
      ? Number.parseInt(searchParams.get("semester")!)
      : undefined;
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page")
      ? Number.parseInt(searchParams.get("page")!)
      : 1;
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit")!)
      : 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const where: any = {};
    if (level) where.level = level;
    if (semester) where.semester = semester;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get courses with pagination
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          tutors: {
            include: {
              tutor: true,
            },
          },
          materials: true,
          pastQuestions: true,
        },
        orderBy: { code: "asc" },
      }),
      prisma.course.count({ where }),
    ]);

    // Transform data to match our frontend types
    const transformedCourses = courses.map((course) => ({
      ...course,
      tutors: course.tutors.map((ct) => ct.tutor),
    }));

    return NextResponse.json({ courses: transformedCourses, total });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course (admin only)
export async function POST(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isAdminUser(authUser.userId);
    console.log("isAdmin", isAdmin);

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: Only an admin can perform this operation" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { code, title, units, level, semester, description, tutorIds } = body;

    if (!code || !title || !level || !semester) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        code,
        title,
        units,
        level: Number.parseInt(level),
        semester: Number.parseInt(semester),
        description,
      },
    });

    // Assign tutors if provided
    if (tutorIds && tutorIds.length > 0) {
      await prisma.courseToTutor.createMany({
        data: tutorIds.map((tutorId: string) => ({
          courseId: course.id,
          tutorId,
        })),
      });
    }

    const createdCourse = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        tutors: {
          include: {
            tutor: true,
          },
        },
        materials: true,
        pastQuestions: true,
      },
    });

    const transformedCourse = {
      ...createdCourse,
      tutors: createdCourse?.tutors.map((ct) => ct.tutor) || [],
    };

    return NextResponse.json(transformedCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { message: "Failed to create course" },
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
