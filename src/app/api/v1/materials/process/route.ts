import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getGrokRAGPipeline } from "@/lib/rag-pipeline-grok";
import { GrokAPIError, RateLimitError, TimeoutError } from "@/lib/grok-client";

const prisma = new PrismaClient();

/**
 * Process a material for RAG by extracting text and generating embeddings using Grok
 */
export async function POST(req: Request) {
    let materialId: string | undefined;
    
    try {
        const body = await req.json();
        materialId = body.materialId;

        if (!materialId) {
            return NextResponse.json(
                { success: false, error: "Material ID is required" },
                { status: 400 }
            );
        }

        // Get material details
        const material = await prisma.material.findUnique({
            where: { id: materialId },
            include: {
                course: {
                    select: { id: true, code: true, title: true },
                },
            },
        });

        if (!material) {
            return NextResponse.json(
                { success: false, error: "Material not found" },
                { status: 404 }
            );
        }

        // Update processing status to "processing"
        await prisma.material.update({
            where: { id: materialId },
            data: { 
                processingStatus: "processing",
            },
        });

        console.log(`[Material Processing] Starting processing for material: ${material.title}`);

        // Get Grok RAG pipeline instance
        const grokRagPipeline = getGrokRAGPipeline();

        // Process PDF using Grok RAG pipeline
        const result = await grokRagPipeline.processPDFForRAG(
            material.fileUrl,
            material.id,
            material.title,
            material.course.id
        );

        if (!result.success) {
            console.error(`[Material Processing] Failed to process material: ${result.error}`);
            
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "PDF processing failed",
                    materialId: material.id,
                },
                { status: 500 }
            );
        }

        console.log(`[Material Processing] Successfully processed material: ${material.title} (${result.chunksCreated} chunks)`);

        return NextResponse.json({
            success: true,
            message: "Material processed successfully using Grok",
            chunksCreated: result.chunksCreated,
            materialId: material.id,
            materialTitle: material.title,
        });

    } catch (error) {
        console.error("[Material Processing] Error:", error);

        // Handle specific Grok API errors
        let errorMessage = "Processing failed";
        let statusCode = 500;

        if (error instanceof RateLimitError) {
            errorMessage = `Rate limit exceeded. Please try again in ${error.retryAfter || 60} seconds.`;
            statusCode = 429;
        } else if (error instanceof TimeoutError) {
            errorMessage = "Request timed out. The PDF may be too large or the service is slow. Please try again.";
            statusCode = 408;
        } else if (error instanceof GrokAPIError) {
            errorMessage = `Grok API error: ${error.message}`;
            statusCode = error.statusCode || 500;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        // Update material status to failed
        if (materialId) {
            try {
                await prisma.material.update({
                    where: { id: materialId },
                    data: { 
                        processingStatus: "failed",
                    },
                });
            } catch (updateError) {
                console.error("[Material Processing] Failed to update material status:", updateError);
            }
        }

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
                materialId,
            },
            { status: statusCode }
        );
    }
}

/**
 * Get processing status for a material
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const materialId = url.searchParams.get('materialId');

    if (!materialId) {
      return NextResponse.json(
        { success: false, error: 'Material ID is required' },
        { status: 400 }
      );
    }

    const material = await prisma.material.findUnique({
      where: { id: materialId },
      select: {
        id: true,
        title: true,
        processed: true,
        processingStatus: true,
        _count: {
          select: { chunks: true },
        },
      },
    });

    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      material: {
        id: material.id,
        title: material.title,
        processed: material.processed,
        processingStatus: material.processingStatus,
        chunksCount: material._count.chunks,
      },
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get processing status' },
      { status: 500 }
    );
  }
}
