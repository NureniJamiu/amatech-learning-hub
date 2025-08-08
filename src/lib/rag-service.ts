import OpenAI from 'openai';
import { PrismaClient } from '@/app/generated/prisma';
import { PDFProcessingService } from './pdf-processing';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();

export interface RAGQueryOptions {
  courseId?: string;
  maxResults?: number;
  similarityThreshold?: number;
}

export interface QueryResult {
  response: string;
  sources: Array<{
    chunkId: string;
    materialTitle: string;
    content: string;
    similarity: number;
  }>;
  confidence: number;
  isOutOfScope: boolean;
  followUpSuggestions?: string[];
}

/**
 * Service for Retrieval-Augmented Generation (RAG) queries
 */
export class RAGService {
  private static readonly DEFAULT_SIMILARITY_THRESHOLD = 0.7;
  private static readonly MAX_CONTEXT_LENGTH = 8000; // Characters

  /**
   * Process a user query and return an AI response with sources
   */
  static async processQuery(
    query: string,
    options: RAGQueryOptions = {}
  ): Promise<QueryResult> {
    try {
      const {
        courseId,
        maxResults = 5,
        similarityThreshold = this.DEFAULT_SIMILARITY_THRESHOLD,
      } = options;

      // Generate embedding for the query
      const queryEmbedding = await this.generateQueryEmbedding(query);

      // Find relevant chunks
      const relevantChunks = await this.findRelevantChunks(
        queryEmbedding,
        { courseId, maxResults, similarityThreshold }
      );

      // Check if we have relevant context
      const isOutOfScope = relevantChunks.length === 0 ||
        relevantChunks[0].similarity < similarityThreshold;

      if (isOutOfScope) {
        return {
          response: this.generateOutOfScopeResponse(courseId),
          sources: [],
          confidence: 0,
          isOutOfScope: true,
          followUpSuggestions: [
            "Would you like me to search my general knowledge instead?",
            "Try asking about a different topic from this course",
            "Check if you've selected the correct course"
          ],
        };
      }

      // Generate response using RAG
      const response = await this.generateRAGResponse(query, relevantChunks);

      return {
        response: response.text,
        sources: relevantChunks.map(chunk => ({
          chunkId: chunk.id,
          materialTitle: chunk.materialTitle,
          content: chunk.content.substring(0, 200) + '...',
          similarity: chunk.similarity,
        })),
        confidence: relevantChunks[0].similarity,
        isOutOfScope: false,
        followUpSuggestions: response.followUpSuggestions,
      };
    } catch (error) {
      console.error('RAG query failed:', error);
      return {
        response: "I'm sorry, I encountered an error while processing your question. Please try again.",
        sources: [],
        confidence: 0,
        isOutOfScope: false,
      };
    }
  }

  /**
   * Generate embedding for user query
   */
  private static async generateQueryEmbedding(query: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    return response.data[0].embedding;
  }

  /**
   * Find relevant material chunks using vector similarity
   */
  private static async findRelevantChunks(
    queryEmbedding: number[],
    options: { courseId?: string; maxResults: number; similarityThreshold: number }
  ): Promise<Array<{
    id: string;
    content: string;
    similarity: number;
    materialTitle: string;
    materialId: string;
  }>> {
    // Get all chunks for the course (or all courses if no courseId)
    const whereClause = options.courseId
      ? { material: { courseId: options.courseId } }
      : {};

    const chunks = await prisma.materialChunk.findMany({
      where: whereClause,
      include: {
        material: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Calculate similarities
    const chunksWithSimilarity = chunks.map(chunk => {
      const similarity = PDFProcessingService.cosineSimilarity(
        queryEmbedding,
        chunk.embedding
      );

      return {
        id: chunk.id,
        content: chunk.content,
        similarity,
        materialTitle: chunk.material.title,
        materialId: chunk.material.id,
      };
    });

    // Sort by similarity and filter by threshold
    return chunksWithSimilarity
      .filter(chunk => chunk.similarity >= options.similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, options.maxResults);
  }

  /**
   * Generate AI response using retrieved context
   */
  private static async generateRAGResponse(
    query: string,
    relevantChunks: Array<{ content: string; materialTitle: string; similarity: number }>
  ): Promise<{ text: string; followUpSuggestions: string[] }> {
    // Combine relevant chunks into context
    let context = '';
    let currentLength = 0;

    for (const chunk of relevantChunks) {
      const chunkText = `[From: ${chunk.materialTitle}]\n${chunk.content}\n\n`;

      if (currentLength + chunkText.length > this.MAX_CONTEXT_LENGTH) {
        break;
      }

      context += chunkText;
      currentLength += chunkText.length;
    }

    const systemPrompt = `You are an AI learning assistant helping students with their course materials.
Use the provided context from course materials to answer the student's question accurately and helpfully.

Guidelines:
- Base your answer primarily on the provided context
- If the context doesn't fully answer the question, say so clearly
- Be educational and explain concepts clearly
- Suggest related topics the student might want to explore
- Keep responses concise but comprehensive
- Always cite which material you're referencing when making specific claims

Context from course materials:
${context}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const responseText = response.choices[0].message.content ||
      "I'm sorry, I couldn't generate a response. Please try rephrasing your question.";

    // Generate follow-up suggestions based on the materials
    const materialTitles = [...new Set(relevantChunks.map(chunk => chunk.materialTitle))];
    const followUpSuggestions = [
      `Tell me more about this topic from ${materialTitles[0]}`,
      "Can you explain this concept in simpler terms?",
      "Are there any examples related to this topic?",
    ];

    return {
      text: responseText,
      followUpSuggestions,
    };
  }

  /**
   * Generate response for out-of-scope queries
   */
  private static generateOutOfScopeResponse(courseId?: string): string {
    if (courseId) {
      return "I couldn't find information about that topic in your selected course materials. This question might not be covered in the uploaded materials, or you might want to try rephrasing your question.";
    } else {
      return "I couldn't find relevant information in the available course materials. Please make sure you've selected the correct course, or try asking about a different topic.";
    }
  }

  /**
   * Get query suggestions based on available materials
   */
  static async getQuerySuggestions(courseId?: string): Promise<string[]> {
    try {
      const whereClause = courseId
        ? { courseId }
        : {};

      const materials = await prisma.material.findMany({
        where: whereClause,
        select: {
          title: true,
          course: {
            select: {
              code: true,
              title: true,
            },
          },
        },
        take: 10,
      });

      const suggestions = materials.map(material =>
        `Tell me about ${material.title.toLowerCase()}`
      );

      return suggestions;
    } catch (error) {
      console.error('Failed to get query suggestions:', error);
      return [
        "What topics are covered in this course?",
        "Can you explain the key concepts?",
        "Help me understand the main ideas",
      ];
    }
  }
}
