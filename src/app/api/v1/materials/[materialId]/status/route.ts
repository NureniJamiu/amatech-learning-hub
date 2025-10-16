import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processingQueue } from "@/lib/processing-queue";

interface Params {
  params: {
    materialId: string;
  };
}

/**
 * GET /api/v1/materials/[materialId]/status
 * Get the processing status of a material
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { materialId } = params;

    // Get material with processing info
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      select: {
        id: true,
        title: true,
        processingStatus: true,
        processingError: true,
        chunksCount: true,
        processingStartedAt: true,
        processingCompletedAt: true,
        processed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!material) {
      return NextResponse.json(
        { message: "Material not found" },
        { status: 404 }
      );
    }

    // Get queue job info if exists
    let queueJob = null;
    try {
      queueJob = await processingQueue.getJobStatusByMaterialId(materialId);
    } catch (error) {
      console.error('Error fetching queue job:', error);
    }

    // Calculate processing duration if applicable
    let processingDuration = null;
    if (material.processingStartedAt && material.processingCompletedAt) {
      processingDuration = Math.round(
        (material.processingCompletedAt.getTime() - material.processingStartedAt.getTime()) / 1000
      );
    }

    return NextResponse.json({
      material: {
        id: material.id,
        title: material.title,
        processingStatus: material.processingStatus,
        processingError: material.processingError,
        chunksCount: material.chunksCount,
        processed: material.processed,
        processingStartedAt: material.processingStartedAt,
        processingCompletedAt: material.processingCompletedAt,
        processingDuration: processingDuration ? `${processingDuration}s` : null,
      },
      queueJob: queueJob ? {
        id: queueJob.id,
        status: queueJob.status,
        attempts: queueJob.attempts,
        maxAttempts: queueJob.maxAttempts,
        error: queueJob.error,
        createdAt: queueJob.createdAt,
        startedAt: queueJob.startedAt,
        completedAt: queueJob.completedAt,
      } : null,
    });
  } catch (error) {
    console.error("Error fetching material status:", error);
    return NextResponse.json(
      { message: "Failed to fetch material status" },
      { status: 500 }
    );
  }
}
