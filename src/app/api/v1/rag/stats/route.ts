import { NextResponse } from 'next/server';
import { ragPipeline } from '@/lib/rag-pipeline';

/**
 * Get RAG system statistics
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const courseId = url.searchParams.get('courseId');

    const stats = await ragPipeline.getCourseStats(courseId || undefined);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get stats',
      },
      { status: 500 }
    );
  }
}
