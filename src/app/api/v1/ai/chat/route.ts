import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getGrokRAGPipeline, ChatHistory } from "@/lib/rag-pipeline-grok";
import { GrokAPIError, RateLimitError, TimeoutError } from "@/lib/grok-client";
import { applyAIQueryRateLimit, withRateLimitHeaders } from "@/lib/rate-limit-helpers";

const prisma = new PrismaClient();

/**
 * Process AI chat query using Grok-powered RAG pipeline
 */
export async function POST(req: NextRequest) {
    try {
        const { message, courseId, materialId, sessionId, userId } = await req.json();

        // Apply rate limiting for AI queries (20 queries per hour per user)
        const rateLimitResponse = await applyAIQueryRateLimit(req, userId);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        if (!message || !userId) {
            return NextResponse.json(
                { success: false, error: "Message and user ID are required" },
                { status: 400 }
            );
        }

        // Validate message length
        if (message.length > 2000) {
            return NextResponse.json(
                { success: false, error: "Message is too long. Please keep it under 2000 characters." },
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
                    title:
                        message.substring(0, 50) +
                        (message.length > 50 ? "..." : ""),
                },
            });
        }

        // Save user message
        await prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                content: message,
                role: "user",
                sources: [],
            },
        });

        // Get recent chat history for context
        const recentMessages = await prisma.chatMessage.findMany({
            where: { sessionId: session.id },
            orderBy: { createdAt: "desc" },
            take: 10, // Last 10 messages (5 exchanges)
        });

        // Format chat history for RAG pipeline
        const chatHistory: ChatHistory[] = [];
        for (let i = recentMessages.length - 1; i >= 1; i -= 2) {
            const humanMsg = recentMessages[i];
            const aiMsg = recentMessages[i - 1];

            if (humanMsg?.role === "user" && aiMsg?.role === "assistant") {
                chatHistory.push({
                    human: humanMsg.content,
                    ai: aiMsg.content,
                });
            }
        }

        console.log(`[AI Chat] Processing query for user ${userId}, session ${session.id}`);

        // Get Grok RAG pipeline instance
        const grokRagPipeline = getGrokRAGPipeline();

        // Process query with Grok RAG pipeline
        // Use materialId if provided, otherwise fall back to courseId
        const ragResult = await grokRagPipeline.queryWithHistory(
            message,
            chatHistory,
            materialId || courseId || undefined
        );

        // Save AI response with source citations
        const aiMessage = await prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                content: ragResult.answer,
                role: "assistant",
                sources: ragResult.sourceDocuments.map(
                    (s) =>
                        `${s.metadata.materialId}_chunk_${s.metadata.chunkIndex}`
                ),
                metadata: {
                    sourceDocuments: ragResult.sourceDocuments.map((doc) => ({
                        materialTitle: doc.metadata.materialTitle,
                        content: doc.content.substring(0, 200),
                        chunkIndex: doc.metadata.chunkIndex,
                        materialId: doc.metadata.materialId,
                        relevanceScore: doc.relevanceScore,
                    })),
                    followUpQuestions: ragResult.followUpQuestions,
                    model: 'grok',
                },
            },
        });

        console.log(`[AI Chat] Successfully generated response for session ${session.id}`);

        const response = NextResponse.json({
            success: true,
            sessionId: session.id,
            messageId: aiMessage.id,
            response: ragResult.answer,
            sourceDocuments: ragResult.sourceDocuments.map(doc => ({
                materialTitle: doc.metadata.materialTitle,
                materialId: doc.metadata.materialId,
                chunkIndex: doc.metadata.chunkIndex,
                content: doc.content.substring(0, 200) + '...',
                relevanceScore: doc.relevanceScore,
            })),
            followUpQuestions: ragResult.followUpQuestions,
            model: 'grok',
        });

        // Add rate limit headers to response
        return withRateLimitHeaders(response, req);

    } catch (error) {
        console.error("[AI Chat] Error:", error);

        // Handle specific Grok API errors with graceful fallback
        let errorMessage = "Query processing failed";
        let statusCode = 500;

        if (error instanceof RateLimitError) {
            errorMessage = "The AI service is experiencing high demand. Please try again in a moment.";
            statusCode = 429;
        } else if (error instanceof TimeoutError) {
            errorMessage = "The request timed out. Please try again with a shorter question.";
            statusCode = 408;
        } else if (error instanceof GrokAPIError) {
            errorMessage = "The AI service is temporarily unavailable. Please try again later.";
            statusCode = 503;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
            },
            { status: statusCode }
        );
    }
}

/**
 * Get chat history for a session with cursor-based pagination
 */
export async function GET(req: NextRequest) {
  // Apply general API rate limiting (100 requests per 15 minutes)
  const { applyAPIRateLimit } = await import("@/lib/rate-limit-helpers");
  const rateLimitResponse = await applyAPIRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

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
      // Get specific session with paginated messages
      const { parseCursorPagination, buildCursorQuery, processCursorResults } = await import('@/lib/pagination');
      const paginationParams = parseCursorPagination(url.searchParams);
      const cursorQuery = buildCursorQuery(paginationParams);

      const [session, messages] = await Promise.all([
        prisma.chatSession.findUnique({
          where: { id: sessionId },
          select: {
            id: true,
            userId: true,
            courseId: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            course: {
              select: { code: true, title: true },
            },
          },
        }),
        prisma.chatMessage.findMany({
          where: { sessionId },
          ...cursorQuery,
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            role: true,
            sources: true,
            metadata: true,
            createdAt: true,
          },
        }),
      ]);

      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Session not found' },
          { status: 404 }
        );
      }

      const paginatedMessages = processCursorResults(messages, paginationParams.limit);

      const response = NextResponse.json({
        success: true,
        session: {
          ...session,
          messages: paginatedMessages.data,
        },
        pageInfo: paginatedMessages.pageInfo,
      });
      return withRateLimitHeaders(response, req);
    } else {
      // Get all sessions for user with cursor-based pagination
      const { parseCursorPagination, buildCursorQuery, processCursorResults } = await import('@/lib/pagination');
      const paginationParams = parseCursorPagination(url.searchParams);
      const cursorQuery = buildCursorQuery(paginationParams);

      const sessions = await prisma.chatSession.findMany({
        where: { userId: userId! },
        ...cursorQuery,
        select: {
          id: true,
          userId: true,
          courseId: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          course: {
            select: { code: true, title: true },
          },
          _count: {
            select: { messages: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      const paginatedSessions = processCursorResults(sessions, paginationParams.limit);

      const response = NextResponse.json({
        success: true,
        sessions: paginatedSessions.data,
        pageInfo: paginatedSessions.pageInfo,
      });
      return withRateLimitHeaders(response, req);
    }
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get chat history' },
      { status: 500 }
    );
  }
}
