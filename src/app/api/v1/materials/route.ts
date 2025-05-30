import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/middleware/auth.middleware";

// GET /api/materials - Get materials with optional filtering
export async function GET(request: NextRequest) {
    try {
        // const authUser = authenticateRequest(request);
        // if (!authUser || !authUser.userId) {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("courseId") || undefined;
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
        if (courseId) where.courseId = courseId;
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
                orderBy: { createdAt: "desc" },
            }),
            prisma.material.count({ where }),
        ]);

        return NextResponse.json({ materials, total });
    } catch (error) {
        console.error("Error fetching materials:", error);
        return NextResponse.json(
            { message: "Failed to fetch materials" },
            { status: 500 }
        );
    }
}

// POST /api/materials - Create a new material
export async function POST(request: NextRequest) {
    try {
        const authUser = authenticateRequest(request);
        if (!authUser || !authUser.userId) {
            console.error("Unauthorized access attempt");
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        const title = formData.get("title") as string;
        const courseId = formData.get("courseId") as string;
        const file = formData.get("file") as string;

        if (!title || !file || !courseId) {
            console.error("Missing required fields:", {
                title,
                file,
                courseId,
            });
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if the course exists
        const courseExists = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!courseExists) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            );
        }

        // Create the material
        const material = await prisma.material.create({
            data: {
                title,
                fileUrl: file,
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
        console.error("Error creating material:", error);
        return NextResponse.json(
            { message: "Failed to create material" },
            { status: 500 }
        );
    }
}
