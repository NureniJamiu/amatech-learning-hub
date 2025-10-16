import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth.middleware";
import prisma from "@/lib/prisma";

// GET /api/v1/user/profile - Get current user profile
export async function GET(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);

        if (authResult instanceof NextResponse) {
            return authResult;
        }

        const user = await prisma.user.findUnique({
            where: { id: authResult.userId },
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

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Format user data to match frontend expectations
        const formattedUser = {
            id: user.id,
            name: `${user.firstname} ${user.lastname}`.trim(),
            email: user.email,
            matricNumber: user.matricNumber,
            department: user.department,
            faculty: user.faculty,
            level: user.level,
            currentSemester: user.currentSemester,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return NextResponse.json(formattedUser);
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT /api/v1/user/profile - Update current user profile
export async function PUT(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);

        if (authResult instanceof NextResponse) {
            return authResult;
        }

        const {
            firstname,
            lastname,
            email,
            matricNumber,
            level,
            currentSemester,
            // Note: department and faculty are excluded from updates as requested
        } = await req.json();

        // Validate required fields
        if (!firstname || !email) {
            return NextResponse.json(
                { message: "First name and email are required" },
                { status: 400 }
            );
        }

        // Check if email is already taken by another user
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
                id: { not: authResult.userId }
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email is already taken" },
                { status: 400 }
            );
        }

        // Check if matric number is already taken by another user (if provided)
        if (matricNumber) {
            const existingMatricUser = await prisma.user.findFirst({
                where: {
                    matricNumber: matricNumber,
                    id: { not: authResult.userId }
                }
            });

            if (existingMatricUser) {
                return NextResponse.json(
                    { message: "Matric number is already taken" },
                    { status: 400 }
                );
            }
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: authResult.userId },
            data: {
                firstname,
                lastname,
                email,
                matricNumber: matricNumber || null,
                level: level || 100,
                currentSemester: currentSemester || 1,
                updatedAt: new Date(),
            },
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

        return NextResponse.json(formattedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
