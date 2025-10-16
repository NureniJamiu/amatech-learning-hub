import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, requireAdmin } from "@/middleware/auth.middleware";
import { isAdminUser } from "@/helpers";
import {
    handleDatabaseError,
    validateRequestBody,
    validatePositiveInteger,
} from "@/lib/db-utils";
import { withCache, CacheKeys, CacheTTL, CacheInvalidation } from "@/lib/cache";

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

        // Create cache key based on query parameters
        const cacheKey = CacheKeys.courseList(
            JSON.stringify({ level, semester, search, page, limit })
        );

        // Use cache wrapper for course data (1 hour TTL)
        const result = await withCache(
            cacheKey,
            CacheTTL.COURSE,
            async () => {
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

                return { courses: transformedCourses, total };
            }
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching courses:", error);
        console.error("Error details:", {
            name: (error as Error)?.name,
            message: (error as Error)?.message,
            stack: (error as Error)?.stack,
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

        // Validate required fields
        const validationError = validateRequestBody(body, [
            "code",
            "title",
            "level",
            "semester",
        ]);
        if (validationError) {
            return NextResponse.json(
                { message: validationError },
                { status: 400 }
            );
        }

        // Validate numeric fields
        const unitsError = validatePositiveInteger(units || 2, "units");
        if (unitsError) {
            return NextResponse.json({ message: unitsError }, { status: 400 });
        }

        const levelError = validatePositiveInteger(level, "level");
        if (levelError) {
            return NextResponse.json({ message: levelError }, { status: 400 });
        }

        const semesterError = validatePositiveInteger(semester, "semester");
        if (semesterError) {
            return NextResponse.json(
                { message: semesterError },
                { status: 400 }
            );
        }

        // Validate semester is 1 or 2
        if (![1, 2].includes(Number(semester))) {
            return NextResponse.json(
                { message: "Semester must be 1 or 2" },
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

        // Use a transaction to ensure atomicity
        const createdCourse = await prisma.$transaction(async (tx) => {
            // Create the course
            const course = await tx.course.create({
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
            if (tutorIds && Array.isArray(tutorIds) && tutorIds.length > 0) {
                // Verify all tutor IDs exist before creating assignments
                const tutorsExist = await tx.tutor.findMany({
                    where: { id: { in: tutorIds } },
                    select: { id: true },
                });

                if (tutorsExist.length !== tutorIds.length) {
                    throw new Error("One or more tutor IDs are invalid");
                }

                await tx.courseToTutor.createMany({
                    data: tutorIds.map((tutorId: string) => ({
                        courseId: course.id,
                        tutorId,
                    })),
                });
            }

            // Return the course with all relationships
            return tx.course.findUnique({
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
        });

        const transformedCourse = {
            ...createdCourse,
            tutors: createdCourse?.tutors.map((ct) => ct.tutor) || [],
        };

        // Invalidate course caches after creation
        CacheInvalidation.invalidateCourse();

        return NextResponse.json(transformedCourse, { status: 201 });
    } catch (error) {
        return handleDatabaseError(error, "course creation");
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
