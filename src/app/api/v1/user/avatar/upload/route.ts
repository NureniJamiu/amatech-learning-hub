import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth.middleware";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Development fallback when Cloudinary is not properly configured
async function handleDevFallback(userId: string, file: File) {
  // In development, we'll use a data URL as avatar
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const dataUrl = `data:${file.type};base64,${base64}`;

  // Update user avatar in database with the data URL
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar: dataUrl },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      matricNumber: true,
      department: true,
      faculty: true,
      level: true,
      currentSemester: true,
      avatar: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    id: updatedUser.id,
    name: `${updatedUser.firstname} ${updatedUser.lastname}`.trim(),
    email: updatedUser.email,
    matricNumber: updatedUser.matricNumber,
    department: updatedUser.department,
    faculty: updatedUser.faculty,
    level: updatedUser.level,
    currentSemester: updatedUser.currentSemester,
    avatar: updatedUser.avatar,
    isAdmin: updatedUser.isAdmin,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Check if we're in development and Cloudinary is not properly configured
    const isDev = process.env.NODE_ENV === 'development';
    const hasValidCloudinary = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
                               process.env.CLOUDINARY_API_KEY &&
                               process.env.CLOUDINARY_API_SECRET;

    if (isDev && !hasValidCloudinary) {
      console.warn('⚠️  Cloudinary not configured - using development fallback');
      const formattedUser = await handleDevFallback(authResult.userId, file);

      return NextResponse.json({
        avatarUrl: formattedUser.avatar,
        user: formattedUser,
        warning: "Development mode: Avatar stored locally. Configure Cloudinary for production."
      });
    }

    if (!hasValidCloudinary) {
      console.error('Missing Cloudinary configuration:', {
        cloud_name: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET,
      });
      return NextResponse.json(
        { message: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    // Verify Cloudinary configuration

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "avatars",
          transformation: [
            { width: 200, height: 200, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" }
          ],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(Buffer.from(bytes));
    });

    const result = uploadResult as any;

    // Update user avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: authResult.userId },
      data: { avatar: result.secure_url },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        matricNumber: true,
        department: true,
        faculty: true,
        level: true,
        currentSemester: true,
        avatar: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Format user data to match frontend expectations
    const formattedUser = {
      id: updatedUser.id,
      name: `${updatedUser.firstname} ${updatedUser.lastname}`.trim(),
      email: updatedUser.email,
      matricNumber: updatedUser.matricNumber,
      department: updatedUser.department,
      faculty: updatedUser.faculty,
      level: updatedUser.level,
      currentSemester: updatedUser.currentSemester,
      avatar: updatedUser.avatar,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return NextResponse.json({
      avatarUrl: result.secure_url,
      user: formattedUser,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Invalid api_key") || error.message.includes("api_key")) {
        return NextResponse.json(
          { message: "Invalid Cloudinary credentials. Please check your API key configuration." },
          { status: 500 }
        );
      }
      if (error.message.includes("Invalid image")) {
        return NextResponse.json(
          { message: "Invalid image file. Please try a different image." },
          { status: 400 }
        );
      }
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { message: "Cloudinary authentication failed. Please check your credentials." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
