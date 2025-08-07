import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, requireAdmin } from "@/middleware/auth.middleware";
import { isAdminUser } from "@/helpers";

// GET /api/courses - Get all courses with optional filtering
export async function GET(request: NextRequest) {
    console.log("Courses GET route hit");
    try {
        // Authentication is optional for GET courses - all users can view courses

        // Test basic Prisma connection first
        console.log("Testing Prisma connection...");
        const courseCount = await prisma.course.count();
        console.log("Total courses in database:", courseCount);

        // Now try the full query
        const { searchParams } = new URL(request.url);
        console.log(
            "Search params:",
            Object.fromEntries(searchParams.entries())
        );

        const level = searchParams.get("level")
            ? Number.parseInt(searchParams.get("level")!)
            : undefined;
        const semester = searchParams.get("semester")
            ? Number.parseInt(searchParams.get("semester")!)
            : undefined;
        const search = searchParams.get("search") || undefined;
        const page = searchParams.get("page")
            ? Number.parseInt(searchParams.get("page")!)
            : 1;
        const limit = searchParams.get("limit")
            ? Number.parseInt(searchParams.get("limit")!)
            : 10;
        const skip = (page - 1) * limit;

        console.log("Query parameters:", {
            level,
            semester,
            search,
            page,
            limit,
            skip,
        });

        // Build filter object
        const where: any = {};
        if (level) where.level = level;
        if (semester) where.semester = semester;
        if (search) {
            where.OR = [
                { code: { contains: search, mode: "insensitive" } },
                { title: { contains: search, mode: "insensitive" } },
            ];
        }

        console.log("Where clause:", where);

        // Get courses with pagination
        const [fullCourses, total] = await Promise.all([
            prisma.course.findMany({
                where,
                skip,
                take: limit,
                include: {
                    tutors: {
                        include: {
                            tutor: true,
                        },
                    },
                    materials: true,
                    pastQuestions: true,
                },
                orderBy: { code: "asc" },
            }),
            prisma.course.count({ where }),
        ]);

        console.log(
            "Full courses query successful, found:",
            fullCourses.length,
            "Total:",
            total
        );

        // Transform data to match our frontend types
        const transformedCourses = fullCourses.map((course) => ({
            ...course,
            tutors: course.tutors.map((ct) => ct.tutor),
        }));

        return NextResponse.json({ courses: transformedCourses, total });
    } catch (error) {
        console.error("Error fetching courses:", error);
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { message: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}

// POST /api/courses - Create a new course (admin only)
export async function POST(request: NextRequest) {
    try {
        // Require admin authentication
        const authResult = await requireAdmin(request);
        if (authResult instanceof NextResponse) {
            return authResult; // Return the error response
        }

        const body = await request.json();
        const { code, title, units, level, semester, description, tutorIds } =
            body;

        if (!code || !title || !level || !semester) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if course with the same code already exists
        const existingCourse = await prisma.course.findUnique({
            where: { code },
        });

        if (existingCourse) {
            return NextResponse.json(
                { message: "A course with this code already exists" },
                { status: 409 }
            );
        }

        const course = await prisma.course.create({
            data: {
                code,
                title,
                units: Number.parseInt(units) || 2,
                level: Number.parseInt(level),
                semester: Number.parseInt(semester),
                description: description || "",
            },
        });

        // Assign tutors if provided
        if (tutorIds && tutorIds.length > 0) {
            await prisma.courseToTutor.createMany({
                data: tutorIds.map((tutorId: string) => ({
                    courseId: course.id,
                    tutorId,
                })),
            });
        }

        const createdCourse = await prisma.course.findUnique({
            where: { id: course.id },
            include: {
                tutors: {
                    include: {
                        tutor: true,
                    },
                },
                materials: true,
                pastQuestions: true,
            },
        });

        const transformedCourse = {
            ...createdCourse,
            tutors: createdCourse?.tutors.map((ct) => ct.tutor) || [],
        };

        return NextResponse.json(transformedCourse, { status: 201 });
    } catch (error) {
        console.error("Error creating course:", error);
        return NextResponse.json(
            { message: "Failed to create course" },
            { status: 500 }
        );
    }
}

// EXAMPLE USAGE
// This is how you would call the API from a client-side component or page
// const fetchCourses = async (userId: string, level?: string) => {
//     const params = new URLSearchParams({ userId });
//     if (level) params.append("level", level);

//     const res = await fetch(`/api/courses?${params.toString()}`);
//     const data = await res.json();
//     return data;
//   };
