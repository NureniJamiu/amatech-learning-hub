import { NextResponse } from 'next/server';
import { ragPipeline } from '@/lib/rag-pipeline';

/**
 * Test endpoint for RAG functionality
 */
export async function POST(req: Request) {
  try {
    const { query, courseId, chatHistory = [] } = await req.json();

    if (!query?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log('Testing RAG query:', query);

    const result = await ragPipeline.queryWithHistory(
      query,
      chatHistory,
      courseId
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('RAG test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Test failed',
      },
      { status: 500 }
    );
  }
}

/**
 * Get RAG system information
 */
export async function GET() {
  try {
    const stats = await ragPipeline.getCourseStats();

    return NextResponse.json({
      success: true,
      message: 'Enhanced RAG Pipeline is ready',
      stats,
      features: [
        'LangChain document processing',
        'Context-aware retrieval with chat history',
        'Improved vector similarity search',
        'Automatic follow-up question generation',
        'Course-specific knowledge isolation',
        'Memory-efficient vector storage',
        'Streaming responses support'
      ]
    });
  } catch (error) {
    console.error('RAG info error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get info',
      },
      { status: 500 }
    );
  }
}
