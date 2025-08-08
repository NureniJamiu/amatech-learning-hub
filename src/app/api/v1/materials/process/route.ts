import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { PDFProcessingService } from '@/lib/pdf-processing';

const prisma = new PrismaClient();

/**
 * Process a material for RAG by extracting text and generating embeddings
 */
export async function POST(req: Request) {
  try {
    const { materialId } = await req.json();

    if (!materialId) {
      return NextResponse.json(
        { success: false, error: 'Material ID is required' },
        { status: 400 }
      );
    }

    // Get material details
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      include: {
        course: {
          select: { code: true, title: true },
        },
      },
    });

    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    // Update processing status
    await prisma.material.update({
      where: { id: materialId },
      data: { processingStatus: 'processing' },
    });

    try {
      // Process PDF
      const processingResult = await PDFProcessingService.processPDF(material.fileUrl);

      if (!processingResult.success) {
        throw new Error(processingResult.error || 'PDF processing failed');
      }

      // Generate embeddings
      const embeddingResult = await PDFProcessingService.generateEmbeddings(
        processingResult.chunks
      );

      if (!embeddingResult.success) {
        throw new Error(embeddingResult.error || 'Embedding generation failed');
      }

      // Save chunks to database
      const chunkData = processingResult.chunks.map((chunk, index) => ({
        materialId,
        content: chunk.content,
        embedding: embeddingResult.embeddings[index],
        chunkIndex: chunk.chunkIndex,
        pageNumber: chunk.pageNumber,
        metadata: chunk.metadata,
      }));

      await prisma.materialChunk.createMany({
        data: chunkData,
      });

      // Update material status
      await prisma.material.update({
        where: { id: materialId },
        data: {
          processed: true,
          processingStatus: 'completed',
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Material processed successfully',
        chunksCreated: processingResult.totalChunks,
      });
    } catch (error) {
      // Update status to failed
      await prisma.material.update({
        where: { id: materialId },
        data: { processingStatus: 'failed' },
      });

      throw error;
    }
  } catch (error) {
    console.error('Material processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed',
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
