import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

// START FROM HERE WHEN NEXT YOU WANT TO WORK ON THIS PROJECT
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("[GET COURSE]", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { courseCode, courseTitle, level, description } = await req.json();

    if (!courseCode && !courseTitle && !level && !description) {
      return NextResponse.json(
        { message: "No update data provided" },
        { status: 400 }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        courseCode,
        courseTitle,
        level,
        description,
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("[UPDATE COURSE]", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedCourse = await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deletedCourse, { status: 200 });
  } catch (error) {
    console.error("[DELETE COURSE]", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
