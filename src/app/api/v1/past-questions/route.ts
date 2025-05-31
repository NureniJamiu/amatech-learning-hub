import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/middleware/auth.middleware";

// GET /api/past-questions - Get pastQuestions with optional filtering
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
        const pqId = searchParams.get("pqId") || undefined;
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
        if (pqId) where.pqId = pqId;
        if (search) {
            where.title = { contains: search, mode: "insensitive" };
        }

        // Get pastQuestions with pagination
        const [pastQuestions, total] = await Promise.all([
            prisma.pastQuestion.findMany({
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
            prisma.pastQuestion.count({ where }),
        ]);

        return NextResponse.json({ pastQuestions, total });
    } catch (error) {
        console.error("Error fetching pastQuestions:", error);
        return NextResponse.json(
            { message: "Failed to fetch pastQuestions" },
            { status: 500 }
        );
    }
}

// POST /api/past-questions - Create a new material
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
        const pastQuestion = await prisma.pastQuestion.create({
            data: {
                title,
                courseId,
                fileUrl: file,
                uploadedById: authUser.userId,
                year: new Date().getFullYear(),
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

        return NextResponse.json(pastQuestion, { status: 201 });
    } catch (error) {
        console.error("Error creating material:", error);
        return NextResponse.json(
            { message: "Failed to create material" },
            { status: 500 }
        );
    }
}
