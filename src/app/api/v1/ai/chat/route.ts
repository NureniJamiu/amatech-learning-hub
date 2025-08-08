import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { RAGService } from '@/lib/rag-service';

const prisma = new PrismaClient();

/**
 * Process AI chat query using RAG
 */
export async function POST(req: Request) {
  try {
    const { message, courseId, sessionId, userId } = await req.json();

    if (!message || !userId) {
      return NextResponse.json(
        { success: false, error: 'Message and user ID are required' },
        { status: 400 }
      );
    }

    // Get or create chat session
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      });
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId,
          courseId: courseId || null,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        },
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        content: message,
        role: 'user',
        sources: [],
      },
    });

    // Process query with RAG
    const ragResult = await RAGService.processQuery(message, {
      courseId: courseId || undefined,
      maxResults: 5,
      similarityThreshold: 0.6,
    });

    // Save AI response
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        content: ragResult.response,
        role: 'assistant',
        sources: ragResult.sources.map(s => s.chunkId),
        metadata: {
          confidence: ragResult.confidence,
          isOutOfScope: ragResult.isOutOfScope,
          sourcesDetails: ragResult.sources,
        },
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      response: ragResult.response,
      sources: ragResult.sources,
      confidence: ragResult.confidence,
      isOutOfScope: ragResult.isOutOfScope,
      followUpSuggestions: ragResult.followUpSuggestions,
    });
  } catch (error) {
    console.error('Chat query error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Query processing failed',
      },
      { status: 500 }
    );
  }
}

/**
 * Get chat history for a session
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('sessionId');
    const userId = url.searchParams.get('userId');

    if (!sessionId && !userId) {
      return NextResponse.json(
        { success: false, error: 'Session ID or User ID is required' },
        { status: 400 }
      );
    }

    if (sessionId) {
      // Get specific session
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          course: {
            select: { code: true, title: true },
          },
        },
      });

      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        session,
      });
    } else {
      // Get all sessions for user
      const sessions = await prisma.chatSession.findMany({
        where: { userId: userId! },
        include: {
          course: {
            select: { code: true, title: true },
          },
          _count: {
            select: { messages: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        sessions,
      });
    }
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get chat history' },
      { status: 500 }
    );
  }
}
