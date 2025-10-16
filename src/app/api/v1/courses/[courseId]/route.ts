import { NextRequest, NextResponse } from "next/server";
// import { authenticateRequest } from "@/middleware/auth.middleware";
// import { isAdminUser } from "@/helpers";

import prisma from "@/lib/prisma";
import {
    handleDatabaseError,
    validateRequestBody,
    validatePositiveInteger,
} from "@/lib/db-utils";
import { withCache, CacheKeys, CacheTTL, CacheInvalidation } from "@/lib/cache";

// GET /api/courses/[id] - Get a single course by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;

        if (!courseId) {
            return NextResponse.json(
                { message: "Course ID is required" },
                { status: 400 }
            );
        }

        // Use caching with parallel queries for better performance
        const transformedCourse = await withCache(
            CacheKeys.course(courseId),
            CacheTTL.COURSE,
            async () => {
                const [course, materials, pastQuestions] = await Promise.all([
                    prisma.course.findUnique({
                        where: { id: courseId },
                        select: {
                            id: true,
                            code: true,
                            title: true,
                            units: true,
                            level: true,
                            semester: true,
                            description: true,
                            createdAt: true,
                            updatedAt: true,
                            tutors: {
                                select: {
                                    tutor: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                            avatar: true,
                                        },
                                    },
                                },
                            },
                        },
                    }),
                    prisma.material.findMany({
                        where: { courseId },
                        select: {
                            id: true,
                            title: true,
                            fileUrl: true,
                            processed: true,
                            processingStatus: true,
                            chunksCount: true,
                            createdAt: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    }),
                    prisma.pastQuestion.findMany({
                        where: { courseId },
                        select: {
                            id: true,
                            title: true,
                            year: true,
                            fileUrl: true,
                            createdAt: true,
                        },
                        orderBy: { year: 'desc' },
                    }),
                ]);

                if (!course) {
                    throw new Error('Course not found');
                }

                // Transform data to match our frontend types
                return {
                    ...course,
                    tutors: course.tutors.map((ct) => ct.tutor),
                    materials,
                    pastQuestions,
                };
            }
        );

        if (!transformedCourse) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(transformedCourse);
    } catch (error) {
        console.error("Error fetching course:", error);
        return NextResponse.json(
            { message: "Failed to fetch course" },
            { status: 500 }
        );
    }
}

// PUT /api/courses/[id] - Update a tutor by ID (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        // const authUser = authenticateRequest(request);
        // if (!authUser || !authUser.userId) {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        // const isAdmin = await isAdminUser(authUser.userId);
        // if (!isAdmin) {
        //     return NextResponse.json(
        //         { message: "Admin access required" },
        //         { status: 403 }
        //     );
        // }

        const { courseId } = await params;
        if (!courseId) {
            return NextResponse.json(
                { message: "Course ID is required" },
                { status: 400 }
            );
        }

        // Check if course exists
        const existingCourse = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!existingCourse) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            );
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

        // Use a transaction to handle course update and tutor assignments atomically
        const updatedCourse = await prisma.$transaction(async (tx) => {
            // Update the course
            const course = await tx.course.update({
                where: { id: courseId },
                data: {
                    code,
                    title,
                    units: Number.parseInt(units),
                    level: Number.parseInt(level),
                    semester: Number.parseInt(semester),
                    description,
                },
            });

            // Handle tutor assignments
            if (tutorIds && Array.isArray(tutorIds)) {
                // First, remove all existing tutor assignments for this course
                await tx.courseToTutor.deleteMany({
                    where: { courseId: course.id },
                });

                // Then, add the new tutor assignments if there are any
                if (tutorIds.length > 0) {
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

        // Invalidate cache for this course
        CacheInvalidation.invalidateCourse(courseId);

        // Transform the response to match the GET route format
        const transformedCourse = {
            ...updatedCourse,
            tutors: updatedCourse?.tutors.map((ct) => ct.tutor) || [],
        };

        return NextResponse.json(transformedCourse);
    } catch (error) {
        return handleDatabaseError(error, "course update");
    }
}

// DELETE /api/courses/[id] - Delete a course by ID (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        // const authUser = authenticateRequest(request);
        // if (!authUser || !authUser.userId) {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        // const isAdmin = await isAdminUser(authUser.userId);
        // if (!isAdmin) {
        //     return NextResponse.json(
        //         { message: "Admin access required" },
        //         { status: 403 }
        //     );
        // }
        const {courseId} = await params;
        if (!courseId) {
            return NextResponse.json(
                { message: "Course ID is required" },
                { status: 400 }
            );
        }

        // Check if course exists
        const existingCourse = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                tutors: true,
            },
        });

        if (!existingCourse) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            );
        }

        // Check if course has associated tutors
        if (existingCourse.tutors.length > 0) {
            return NextResponse.json(
                {
                    message: "Cannot delete course with associated tutors. Please remove tutor associations first."
                },
                { status: 400 }
            );
        }

        // Delete the course
        await prisma.course.delete({
            where: { id: courseId },
        });

        // Invalidate cache for this course
        CacheInvalidation.invalidateCourse(courseId);

        return NextResponse.json(
            { message: "Course deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json(
            { message: "Failed to delete course" },
            { status: 500 }
        );
    }
}
