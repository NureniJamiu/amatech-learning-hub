import { NextRequest, NextResponse } from "next/server";
// import { authenticateRequest } from "@/middleware/auth.middleware";
// import { isAdminUser } from "@/helpers";

import prisma from "@/lib/prisma";

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

        const course = await prisma.course.findUnique({
            where: { id: courseId },
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

        if (!course) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: 404 }
            );
        }

        // Transform data to match our frontend types
        const transformedCourse = {
            ...course,
            tutors: course.tutors.map((ct) => ct.tutor),
        };

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

        if (!code || !title || !level || !semester) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: {
                code,
                title,
                units: Number.parseInt(units),
                level: Number.parseInt(level),
                semester: Number.parseInt(semester),
                description,
            },
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

        // Assign tutors if provided
        if (tutorIds && tutorIds.length > 0) {
            await prisma.courseToTutor.createMany({
                data: tutorIds.map((tutorId: string) => ({
                    courseId: updatedCourse.id,
                    tutorId,
                })),
            });
        }

        // Transform the response to match the GET route format
        const transformedCourse = {
            ...updatedCourse,
            tutors: updatedCourse?.tutors.map((ct) => ct.tutor) || [],
        };

        return NextResponse.json(transformedCourse);
    } catch (error) {
        console.error("Error updating course:", error);
        return NextResponse.json(
            { message: "Failed to update course" },
            { status: 500 }
        );
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
