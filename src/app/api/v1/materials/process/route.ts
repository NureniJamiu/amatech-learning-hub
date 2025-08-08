import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { ragPipeline } from "@/lib/rag-pipeline";

const prisma = new PrismaClient();

/**
 * Process a material for RAG by extracting text and generating embeddings
 */
export async function POST(req: Request) {
    try {
        const { materialId } = await req.json();

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

        // Update processing status
        await prisma.material.update({
            where: { id: materialId },
            data: { processingStatus: "processing" },
        });

        // Process PDF using enhanced RAG pipeline
        const result = await ragPipeline.processPDFForRAG(
            material.fileUrl,
            material.id,
            material.title,
            material.course.id
        );

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "PDF processing failed",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Material processed successfully",
            chunksCreated: result.chunksCreated,
        });
    } catch (error) {
        console.error("Material processing error:", error);

        // Update status to failed if we have materialId
        try {
            const { materialId } = await req.json();
            if (materialId) {
                await prisma.material.update({
                    where: { id: materialId },
                    data: { processingStatus: "failed" },
                });
            }
        } catch (updateError) {
            console.error("Failed to update material status:", updateError);
        }

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Processing failed",
            },
            { status: 500 }
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
