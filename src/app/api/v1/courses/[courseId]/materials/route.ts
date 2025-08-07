import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/middleware/auth.middleware";

interface Params {
  params: {
    courseId: string;
  };
}

// GET /api/courses/[courseId]/materials - Get all materials for a specific course
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // const authUser = authenticateRequest(request);
    // if (!authUser || !authUser.userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { courseId } = params;

    // Check if course exists
    const courseExists = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!courseExists) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page")
      ? Number.parseInt(searchParams.get("page")!)
      : 1;
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit")!)
      : 10;
    const search = searchParams.get("search") || undefined;
    const skip = (page - 1) * limit;

    // Build filter object
    const where: any = { courseId };
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    // Get materials with pagination
    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where,
        skip,
        take: limit,
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.material.count({ where }),
    ]);

    return NextResponse.json({ materials, total });
  } catch (error) {
    console.error("Error fetching course materials:", error);
    return NextResponse.json(
      { message: "Failed to fetch course materials" },
      { status: 500 }
    );
  }
}

// POST /api/courses/[courseId]/materials - Add materials to a specific course
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const authUser = await authenticateRequest(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = params;
    const body = await request.json();
    const { title, fileUrl } = body;

    if (!title || !fileUrl) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if course exists
    const courseExists = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!courseExists) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    // Create the material
    const material = await prisma.material.create({
      data: {
        title,
        fileUrl,
        courseId,
        uploadedById: authUser.userId,
      },
      include: {
        course: {
          select: {
            code: true,
            title: true,
          },
        },
        uploadedBy: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("Error adding course material:", error);
    return NextResponse.json(
      { message: "Failed to add course material" },
      { status: 500 }
    );
  }
}
