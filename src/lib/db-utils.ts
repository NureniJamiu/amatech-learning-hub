import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma";

export function handleDatabaseError(error: any, operation: string = "operation") {
    console.error(`Database error during ${operation}:`, error);

    // Handle Prisma specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                // Unique constraint violation
                const meta = error.meta as { target?: string[] };
                const field = meta?.target?.[0] || 'field';
                return NextResponse.json(
                    {
                        message: `A record with this ${field} already exists.`,
                        error: "UNIQUE_CONSTRAINT_VIOLATION"
                    },
                    { status: 409 }
                );

            case 'P2025':
                // Record not found
                return NextResponse.json(
                    {
                        message: "The requested record was not found.",
                        error: "RECORD_NOT_FOUND"
                    },
                    { status: 404 }
                );

            case 'P2003':
                // Foreign key constraint violation
                return NextResponse.json(
                    {
                        message: "This action would violate a data relationship constraint.",
                        error: "FOREIGN_KEY_CONSTRAINT_VIOLATION"
                    },
                    { status: 400 }
                );

            case 'P2014':
                // Required relation violation
                return NextResponse.json(
                    {
                        message: "This action would violate a required relationship.",
                        error: "REQUIRED_RELATION_VIOLATION"
                    },
                    { status: 400 }
                );

            default:
                // Other Prisma errors
                return NextResponse.json(
                    {
                        message: `Database operation failed: ${error.message}`,
                        error: "DATABASE_ERROR"
                    },
                    { status: 500 }
                );
        }
    }

    // Handle validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
        return NextResponse.json(
            {
                message: "Invalid data provided for the operation.",
                error: "VALIDATION_ERROR"
            },
            { status: 400 }
        );
    }

    // Handle connection errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return NextResponse.json(
            {
                message: "Database connection failed. Please try again later.",
                error: "DATABASE_CONNECTION_ERROR"
            },
            { status: 503 }
        );
    }

    // Generic error handling
    return NextResponse.json(
        {
            message: `Failed to complete ${operation}. Please try again.`,
            error: "INTERNAL_SERVER_ERROR"
        },
        { status: 500 }
    );
}

export function validateRequestBody(body: any, requiredFields: string[]): string | null {
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
        return `Missing required fields: ${missingFields.join(', ')}`;
    }

    return null;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePositiveInteger(value: any, fieldName: string): string | null {
    const num = Number(value);
    if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
        return `${fieldName} must be a positive integer`;
    }
    return null;
}
