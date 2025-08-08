import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { ragPipeline, ChatHistory } from "@/lib/rag-pipeline";

const prisma = new PrismaClient();

/**
 * Process AI chat query using enhanced RAG pipeline
 */
export async function POST(req: Request) {
    try {
        const { message, courseId, sessionId, userId } = await req.json();

        if (!message || !userId) {
            return NextResponse.json(
                { success: false, error: "Message and user ID are required" },
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

        // Process query with enhanced RAG pipeline
        const ragResult = await ragPipeline.queryWithHistory(
            message,
            chatHistory,
            courseId || undefined
        );

        // Save AI response
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
                    })),
                    followUpQuestions: ragResult.followUpQuestions,
                },
            },
        });

        return NextResponse.json({
            success: true,
            sessionId: session.id,
            messageId: aiMessage.id,
            response: ragResult.answer,
            sourceDocuments: ragResult.sourceDocuments,
            followUpQuestions: ragResult.followUpQuestions,
        });
    } catch (error) {
        console.error("Chat query error:", error);
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Query processing failed",
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
