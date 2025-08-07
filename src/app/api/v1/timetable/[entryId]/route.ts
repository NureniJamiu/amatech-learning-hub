import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth.middleware";

// GET /api/v1/timetable/[entryId] - Get a specific timetable entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const { entryId } = await params;

    const timetableEntry = await prisma.timetableEntry.findFirst({
      where: {
        id: entryId,
        userId: user.id, // Ensure user can only access their own entries
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

    if (!timetableEntry) {
      return NextResponse.json(
        { error: "Timetable entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(timetableEntry);
  } catch (error) {
    console.error("Error fetching timetable entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetable entry" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/timetable/[entryId] - Update a specific timetable entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const { entryId } = await params;
    const body = await request.json();
    const { day, time, location, semester, courseId } = body;

    // Check if the timetable entry exists and belongs to the user
    const existingEntry = await prisma.timetableEntry.findFirst({
      where: {
        id: entryId,
        userId: user.id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Timetable entry not found" },
        { status: 404 }
      );
    }

    // Validate semester if provided
    if (semester && ![1, 2].includes(parseInt(semester))) {
      return NextResponse.json(
        { error: "Semester must be 1 or 2" },
        { status: 400 }
      );
    }

    // Verify course exists if courseId is being updated
    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }
    }

    // Check for scheduling conflicts if day or time is being updated
    if (day || time || semester) {
      const conflictEntry = await prisma.timetableEntry.findFirst({
        where: {
          userId: user.id,
          day: day || existingEntry.day,
          time: time || existingEntry.time,
          semester: semester ? parseInt(semester) : existingEntry.semester,
          NOT: {
            id: entryId, // Exclude the current entry
          },
        },
      });

      if (conflictEntry) {
        return NextResponse.json(
          { error: "Schedule conflict: You already have a class at this time" },
          { status: 409 }
        );
      }
    }

    const updateData: any = {};
    if (day) updateData.day = day;
    if (time) updateData.time = time;
    if (location) updateData.location = location;
    if (semester) updateData.semester = parseInt(semester);
    if (courseId) updateData.courseId = courseId;

    const updatedEntry = await prisma.timetableEntry.update({
      where: { id: entryId },
      data: updateData,
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

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Error updating timetable entry:", error);
    return NextResponse.json(
      { error: "Failed to update timetable entry" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/timetable/[entryId] - Delete a specific timetable entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const { entryId } = await params;

    // Check if the timetable entry exists and belongs to the user
    const existingEntry = await prisma.timetableEntry.findFirst({
      where: {
        id: entryId,
        userId: user.id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Timetable entry not found" },
        { status: 404 }
      );
    }

    await prisma.timetableEntry.delete({
      where: { id: entryId },
    });

    return NextResponse.json(
      { message: "Timetable entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting timetable entry:", error);
    return NextResponse.json(
      { error: "Failed to delete timetable entry" },
      { status: 500 }
    );
  }
}
