import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/middleware/auth.middleware";
import { isAdminUser } from "@/helpers";

import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// GET /api/tutors - Get all tutors with optional filtering
export async function GET(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page")
      ? Number.parseInt(searchParams.get("page")!)
      : 1;
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit")!)
      : 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tutors, total] = await Promise.all([
      prisma.tutor.findMany({
        where,
        skip,
        take: limit,
        include: {
          courses: {
            include: {
              course: true,
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.tutor.count({ where }),
    ]);

    const transformedTutors = tutors.map((tutor) => ({
      ...tutor,
      courses: tutor.courses.map((ct) => ct.course),
    }));

    return NextResponse.json({ tutors: transformedTutors, total });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return NextResponse.json(
      { message: "Failed to fetch tutors" },
      { status: 500 }
    );
  }
}

// POST /api/tutors - Create a new tutor (admin only)
export async function POST(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isAdminUser(authUser.userId);
    console.log("isAdmin", isAdmin);

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const avatarFile = formData.get("avatar") as File | null;

      //     const cloudinaryResponse = await cloudinary.uploader.upload(avatarFile, {
      //     upload_preset: "tutors",
      //   });

      if (!name || !email) {
        return NextResponse.json(
          { message: "Name and email are required" },
          { status: 400 }
        );
      }

      const tutorData: any = {
        name,
        email,
      };

      //   TODO - Handle file upload to Cloudinary or any other storage service
      //   const cloudinaryResponse = await cloudinary.uploader.upload(avatarFile, {
      //     upload_preset: "tutors",
      //   });

      //   tutorData.avatar = cloudinaryResponse.secure_url;

      const tutor = await prisma.tutor.create({
        data: tutorData,
      });

      return NextResponse.json(tutor);
    } else {
      const body = await request.json();
      const { name, email, avatar } = body;

      if (!name || !email) {
        return NextResponse.json(
          { message: "Name and email are required" },
          { status: 400 }
        );
      }

      const tutor = await prisma.tutor.create({
        data: {
          name,
          email,
          avatar,
        },
      });

      return NextResponse.json(tutor, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating tutor:", error);
    return NextResponse.json(
      { message: "Failed to create tutor" },
      { status: 500 }
    );
  }
}
