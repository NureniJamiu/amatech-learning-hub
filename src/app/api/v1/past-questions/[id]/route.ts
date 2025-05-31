import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/middleware/auth.middleware";
import { isAdminUser } from "@/helpers";

// interface Params {
//   params: {
//     id: string;
//   };
// }

// GET /api/materials/[id] - Get a specific material by ID
export async function GET(request: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
  try {
    // const authUser = authenticateRequest(request);
    // if (!authUser || !authUser.userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id: pqId } = await params;

    const pastQuestion = await prisma.pastQuestion.findUnique({
      where: { id: pqId },
      include: {
        course: {
          select: {
            id: true,
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

    if (!pastQuestion) {
      return NextResponse.json({ message: "pastQuestion not found" }, { status: 404 });
    }

    return NextResponse.json(pastQuestion);
  } catch (error) {
    console.error("Error fetching pastQuestion:", error);
    return NextResponse.json(
      { message: "Failed to fetch pastQuestion" },
      { status: 500 }
    );
  }
}

// PATCH /api/pastQuestions/[id] - Update a pastQuestion
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // const authUser = authenticateRequest(request);
    // if (!authUser || !authUser.userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id: pqId } = await params;
    const body = await request.json();
    const { title, fileUrl, courseId } = body;

    // Check if pastQuestion exists and user has permission to update
    const existingPastQuestion = await prisma.pastQuestion.findUnique({
      where: { id: pqId },
      select: { uploadedById: true },
    });

    if (!existingPastQuestion) {
      return NextResponse.json({ message: "Past Question not found" }, { status: 404 });
    }

    // Check if user is the uploader or an admin
    // const isAdmin = await isAdminUser(authUser.userId);
    // if (existingMaterial.uploadedById !== authUser.userId && !isAdmin) {
    //   return NextResponse.json(
    //     { message: "You don't have permission to update this material" },
    //     { status: 403 }
    //   );
    // }

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
    if (courseId !== undefined) {
      // Verify course exists if changing course
      const courseExists = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!courseExists) {
        return NextResponse.json(
          { message: "Course not found" },
          { status: 404 }
        );
      }

      updateData.courseId = courseId;
    }

    // Update the material
    const updatedPastQuestion = await prisma.pastQuestion.update({
      where: { id: pqId },
      data: updateData,
      include: {
        course: {
          select: {
            id: true,
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

    return NextResponse.json(updatedPastQuestion);
  } catch (error) {
    console.error("Error updating past question:", error);
    return NextResponse.json(
      { message: "Failed to update past question" },
      { status: 500 }
    );
  }
}

// DELETE /api/past-questions/[id] - Delete a material
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // const authUser = authenticateRequest(request);
    // if (!authUser || !authUser.userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id: pqId } = await params;

    // Check if material exists and user has permission to delete
    const existingPastQuestion = await prisma.pastQuestion.findUnique({
      where: { id: pqId },
      select: { uploadedById: true },
    });

    if (!existingPastQuestion) {
      return NextResponse.json({ message: "Past question not found" }, { status: 404 });
    }

    // Check if user is the uploader or an admin
    // const isAdmin = await isAdminUser(authUser.userId);
    // if (existingMaterial.uploadedById !== authUser.userId && !isAdmin) {
    //   return NextResponse.json(
    //     { message: "You don't have permission to delete this material" },
    //     { status: 403 }
    //   );
    // }

    // Delete the material
    await prisma.pastQuestion.delete({ where: { id: pqId } });

    return NextResponse.json({ message: "Past question deleted successfully" });
  } catch (error) {
    console.error("Error deleting past question:", error);
    return NextResponse.json(
      { message: "Failed to delete past question" },
      { status: 500 }
    );
  }
}
