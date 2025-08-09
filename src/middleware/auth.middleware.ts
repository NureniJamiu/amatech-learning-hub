import { verifyAuthToken } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const authenticateRequest = async (
    req: NextRequest
): Promise<{ userId: string } | null> => {
    const authHeader =
        req.headers.get("authorization") || req.headers.get("Authorization");

    if (!authHeader) {
        return null;
    }

    if (!authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyAuthToken(token);

    return decoded ?? null;
};

// Enhanced authentication middleware with user validation
export const authenticateAndValidateUser = async (
    req: NextRequest
): Promise<{ userId: string; user: any } | null> => {
    const authResult = await authenticateRequest(req);

    if (!authResult) {
        return null;
    }

    try {
        // Verify user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: authResult.userId },
            select: {
                id: true,
                email: true,
                isAdmin: true,
                firstname: true,
                lastname: true,
            },
        });

        if (!user) {
            return null;
        }

        return { userId: authResult.userId, user };
    } catch (error) {
        return null;
    }
};

// Helper to check admin permissions
export const requireAdmin = async (
    req: NextRequest
): Promise<{ userId: string; user: any } | NextResponse> => {
    const authResult = await authenticateAndValidateUser(req);

    if (!authResult) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authResult.user.isAdmin) {
        return NextResponse.json(
            { message: "Forbidden: Admin access required" },
            { status: 403 }
        );
    }

    return authResult;
};

// Helper to require authentication
export const requireAuth = async (
    req: NextRequest
): Promise<{ userId: string; user: any } | NextResponse> => {
    const authResult = await authenticateAndValidateUser(req);

    if (!authResult) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return authResult;
};
