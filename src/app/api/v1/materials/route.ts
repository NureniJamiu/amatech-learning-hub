import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/middleware/auth.middleware";
import { processingQueue } from "@/lib/processing-queue";
import { applyAPIRateLimit, applyFileUploadRateLimit, withRateLimitHeaders } from "@/lib/rate-limit-helpers";
import { withCache, CacheKeys, CacheTTL, CacheInvalidation } from "@/lib/cache";

// GET /api/materials - Get materials with optional filtering
export async function GET(request: NextRequest) {
    // Apply general API rate limiting (100 requests per 15 minutes)
    const rateLimitResponse = await applyAPIRateLimit(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

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

        // Parse pagination parameters using utility
        const { parseOffsetPagination, buildOffsetQuery, processOffsetResults } = await import('@/lib/pagination');
        const paginationParams = parseOffsetPagination(searchParams);
        const offsetQuery = buildOffsetQuery(paginationParams);

        // Build filter object
        const where: any = {};
        if (courseId) where.courseId = courseId;
        if (search) {
            where.title = { contains: search, mode: "insensitive" };
        }

        // Create cache key based on query parameters
        const cacheKey = CacheKeys.materialList(
            JSON.stringify({ courseId, search, ...paginationParams })
        );

        // Use cache wrapper for material list (10 minutes TTL)
        const paginatedResult = await withCache(
            cacheKey,
            CacheTTL.MATERIAL_LIST,
            async () => {
                // Get materials with pagination
                const [materials, total] = await Promise.all([
                    prisma.material.findMany({
                        where,
                        ...offsetQuery,
                        select: {
                            id: true,
                            title: true,
                            fileUrl: true,
                            courseId: true,
                            uploadedById: true,
                            processed: true,
                            processingStatus: true,
                            chunksCount: true,
                            createdAt: true,
                            updatedAt: true,
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

                return processOffsetResults(materials, total, paginationParams);
            }
        );

        const response = NextResponse.json({
            materials: paginatedResult.data,
            pagination: paginatedResult.pagination,
        });
        return withRateLimitHeaders(response, request);
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
        const authUser = await authenticateRequest(request);
        if (!authUser || !authUser.userId) {
            console.error("Unauthorized access attempt");
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Apply file upload rate limiting (10 uploads per hour per user)
        const rateLimitResponse = await applyFileUploadRateLimit(request, authUser.userId);
        if (rateLimitResponse) {
            return rateLimitResponse;
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

        // Create the material with queued status
        const material = await prisma.material.create({
            data: {
                title,
                fileUrl: file,
                courseId,
                uploadedById: authUser.userId,
                processingStatus: 'pending', // Will be updated to 'queued' when added to queue
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

        // Add to processing queue
        try {
            await processingQueue.addJob({
                materialId: material.id,
                fileUrl: file,
                materialTitle: title,
                courseId,
            });

            console.log(`Material ${material.id} added to processing queue`);
        } catch (queueError) {
            console.error('Error adding material to queue:', queueError);
            // Material is created but not queued - can be retried later
        }

        // Invalidate material caches after creation
        CacheInvalidation.invalidateMaterial();

        const response = NextResponse.json({
            ...material,
            message: 'Material uploaded successfully and queued for processing',
        }, { status: 201 });

        // Add rate limit headers to response
        return withRateLimitHeaders(response, request);
    } catch (error) {
        console.error("Error creating material:", error);
        return NextResponse.json(
            { message: "Failed to create material" },
            { status: 500 }
        );
    }
}
