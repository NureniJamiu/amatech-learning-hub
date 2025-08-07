import { NextRequest, NextResponse } from "next/server";
// import { authenticateRequest } from "@/middleware/auth.middleware";
// import { isAdminUser } from "@/helpers";

import prisma from "@/lib/prisma";
import {
    handleDatabaseError,
    validateRequestBody,
    validateEmail,
} from "@/lib/db-utils";

// PUT /api/tutors/[id] - Update a tutor by ID (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        const { id: tutorId } = await params;
        if (!tutorId) {
            return NextResponse.json(
                { message: "Tutor ID is required" },
                { status: 400 }
            );
        }

        // Check if tutor exists
        const existingTutor = await prisma.tutor.findUnique({
            where: { id: tutorId },
        });

        if (!existingTutor) {
            return NextResponse.json(
                { message: "Tutor not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { name, email, avatar } = body;

        // Validate required fields
        const validationError = validateRequestBody(body, ["name", "email"]);
        if (validationError) {
            return NextResponse.json(
                { message: validationError },
                { status: 400 }
            );
        }

        // Validate email format
        if (!validateEmail(email)) {
            return NextResponse.json(
                { message: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        // Check if email is already taken by another tutor
        const emailExists = await prisma.tutor.findFirst({
            where: {
                email,
                NOT: { id: tutorId },
            },
        });

        if (emailExists) {
            return NextResponse.json(
                { message: "Email is already in use by another tutor" },
                { status: 400 }
            );
        }

        const updatedTutor = await prisma.tutor.update({
            where: { id: tutorId },
            data: {
                name,
                email,
                avatar,
            },
            include: {
                courses: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        // Transform the response to match the GET route format
        const transformedTutor = {
            ...updatedTutor,
            courses: updatedTutor.courses.map((ct) => ct.course),
        };

        return NextResponse.json(transformedTutor);
    } catch (error) {
        return handleDatabaseError(error, "tutor update");
    }
}

// DELETE /api/course/[id] - Delete a tutor by ID (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        const { id: tutorId } = await params;
        if (!tutorId) {
            return NextResponse.json(
                { message: "Tutor ID is required" },
                { status: 400 }
            );
        }

        // Check if tutor exists
        const existingTutor = await prisma.tutor.findUnique({
            where: { id: tutorId },
            include: {
                courses: true,
            },
        });

        if (!existingTutor) {
            return NextResponse.json(
                { message: "Tutor not found" },
                { status: 404 }
            );
        }

        // Check if tutor has associated courses
        if (existingTutor.courses.length > 0) {
            return NextResponse.json(
                {
                    message:
                        "Cannot delete tutor with associated courses. Please remove course associations first.",
                },
                { status: 400 }
            );
        }

        // Delete the tutor
        await prisma.tutor.delete({
            where: { id: tutorId },
        });

        return NextResponse.json(
            { message: "Tutor deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return handleDatabaseError(error, "tutor deletion");
    }
}
