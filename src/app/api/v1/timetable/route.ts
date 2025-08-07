import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth.middleware";

// GET /api/v1/timetable - Get current user's timetable entries
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester");

    const whereClause: any = {
      userId: user.id,
    };

    // Filter by semester if provided
    if (semester) {
      whereClause.semester = parseInt(semester);
    }

    const timetableEntries = await prisma.timetableEntry.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            id: true,
            code: true,
            title: true,
            units: true,
            level: true,
            semester: true,
          },
        },
      },
      orderBy: [
        { semester: "asc" },
        { day: "asc" },
        { time: "asc" },
      ],
    });

    return NextResponse.json(timetableEntries);
  } catch (error) {
    console.error("Error fetching timetable entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetable entries" },
      { status: 500 }
    );
  }
}

// POST /api/v1/timetable - Create a new timetable entry
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await request.json();
    const { day, time, location, semester, courseId } = body;

    // Validate required fields
    if (!day || !time || !location || !semester || !courseId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate semester
    if (![1, 2].includes(parseInt(semester))) {
      return NextResponse.json(
        { error: "Semester must be 1 or 2" },
        { status: 400 }
      );
    }

    // Verify that the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check for scheduling conflicts (same user, day, and overlapping time)
    const existingEntry = await prisma.timetableEntry.findFirst({
      where: {
        userId: user.id,
        day,
        time,
        semester: parseInt(semester),
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Schedule conflict: You already have a class at this time" },
        { status: 409 }
      );
    }

    const timetableEntry = await prisma.timetableEntry.create({
      data: {
        day,
        time,
        location,
        semester: parseInt(semester),
        userId: user.id,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            code: true,
            title: true,
            units: true,
            level: true,
            semester: true,
          },
        },
      },
    });

    return NextResponse.json(timetableEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating timetable entry:", error);
    return NextResponse.json(
      { error: "Failed to create timetable entry" },
      { status: 500 }
    );
  }
}
