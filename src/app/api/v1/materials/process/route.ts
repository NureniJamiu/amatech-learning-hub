import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getGrokRAGPipeline } from "@/lib/rag-pipeline-grok";
import { GrokAPIError, RateLimitError, TimeoutError } from "@/lib/grok-client";
import { CacheInvalidation } from "@/lib/cache";

const prisma = new PrismaClient();

/**
 * Process a material for RAG by extracting text and generating embeddings using Groq
 * This endpoint starts async processing and returns immediately
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

        // Invalidate material cache when status changes
        CacheInvalidation.invalidateMaterial(materialId);

        console.log(`[Material Processing] Starting async processing for material: ${material.title}`);

        // Start async processing (don't await)
        processMataterialAsync(material).catch(error => {
            console.error(`[Material Processing] Async processing failed for ${material.id}:`, error);
        });

        // Return immediately
        return NextResponse.json({
            success: true,
            message: "Material processing started",
            materialId: material.id,
            materialTitle: material.title,
            status: "processing",
        });

    } catch (error) {
        console.error("[Material Processing] Error:", error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Processing failed",
                materialId,
            },
            { status: 500 }
        );
    }
}

/**
 * Async function to process material in the background
 */
async function processMataterialAsync(material: any) {
    try {
        // Get Groq RAG pipeline instance
        const grokRagPipeline = getGrokRAGPipeline();

        // Process PDF using Groq RAG pipeline
        const result = await grokRagPipeline.processPDFForRAG(
            material.fileUrl,
            material.id,
            material.title,
            material.course.id
        );

        if (!result.success) {
            console.error(`[Material Processing] Failed to process material: ${result.error}`);
            
            // Update status to failed
            await prisma.material.update({
                where: { id: material.id },
                data: { 
                    processingStatus: "failed",
                },
            });
            
            CacheInvalidation.invalidateMaterial(material.id);
            return;
        }

        console.log(`[Material Processing] Successfully processed material: ${material.title} (${result.chunksCreated} chunks)`);

        // Invalidate material cache after successful processing
        CacheInvalidation.invalidateMaterial(material.id);

    } catch (error) {
        console.error("[Material Processing] Async error:", error);

        // Update material status to failed
        try {
            await prisma.material.update({
                where: { id: material.id },
                data: { 
                    processingStatus: "failed",
                },
            });
            
            CacheInvalidation.invalidateMaterial(material.id);
        } catch (updateError) {
            console.error("[Material Processing] Failed to update material status:", updateError);
        }
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
