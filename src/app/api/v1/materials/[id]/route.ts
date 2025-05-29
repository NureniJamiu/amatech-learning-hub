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

    const { id: materialId } = await params;

    const material = await prisma.material.findUnique({
      where: { id: materialId },
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

    if (!material) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 });
    }

    return NextResponse.json(material);
  } catch (error) {
    console.error("Error fetching material:", error);
    return NextResponse.json(
      { message: "Failed to fetch material" },
      { status: 500 }
    );
  }
}

// PATCH /api/materials/[id] - Update a material
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // const authUser = authenticateRequest(request);
    // if (!authUser || !authUser.userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id: materialId } = await params;
    const body = await request.json();
    const { title, fileUrl, courseId } = body;

    // Check if material exists and user has permission to update
    const existingMaterial = await prisma.material.findUnique({
      where: { id: materialId },
      select: { uploadedById: true },
    });

    if (!existingMaterial) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 });
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
    const updatedMaterial = await prisma.material.update({
      where: { id: materialId },
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

    return NextResponse.json(updatedMaterial);
  } catch (error) {
    console.error("Error updating material:", error);
    return NextResponse.json(
      { message: "Failed to update material" },
      { status: 500 }
    );
  }
}

// DELETE /api/materials/[id] - Delete a material
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // const authUser = authenticateRequest(request);
    // if (!authUser || !authUser.userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id: materialId } = await params;

    // Check if material exists and user has permission to delete
    const existingMaterial = await prisma.material.findUnique({
      where: { id: materialId },
      select: { uploadedById: true },
    });

    if (!existingMaterial) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 });
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
    await prisma.material.delete({ where: { id: materialId } });

    return NextResponse.json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { message: "Failed to delete material" },
      { status: 500 }
    );
  }
}
