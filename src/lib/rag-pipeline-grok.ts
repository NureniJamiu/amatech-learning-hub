/**
 * Grok-based RAG Pipeline
 * 
 * Enhanced RAG pipeline using Grok API for embeddings and chat completions
 * Maintains backward compatibility with existing RAG pipeline interface
 */

import { PrismaClient } from '@/app/generated/prisma';
import { parsePdfBuffer } from "./pdf-parser";
import { getGrokClient, GrokAPIError, RateLimitError, TimeoutError } from './grok-client';

const prisma = new PrismaClient();

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    materialId: string;
    materialTitle: string;
    courseId: string;
    chunkIndex: number;
    pageNumber?: number;
    source: string;
  };
}

export interface RAGResponse {
  answer: string;
  sourceDocuments: Array<{
    content: string;
    metadata: DocumentChunk['metadata'];
    relevanceScore?: number;
  }>;
  conversationId?: string;
  followUpQuestions?: string[];
}

export interface ChatHistory {
  human: string;
  ai: string;
}

export interface RAGConfig {
  chunkSize: number;
  chunkOverlap: number;
  maxContextLength: number;
  similarityThreshold: number;
  maxResults: number;
}

export class GrokRAGPipeline {
  private grokClient;
  private config: RAGConfig;

  constructor(config?: Partial<RAGConfig>) {
    this.grokClient = getGrokClient();
    this.config = {
      chunkSize: config?.chunkSize || 1000,
      chunkOverlap: config?.chunkOverlap || 200,
      maxContextLength: config?.maxContextLength || 8000,
      similarityThreshold: config?.similarityThreshold || 0.7,
      maxResults: config?.maxResults || 5,
    };
  }

  /**
   * Split text into overlapping chunks
   */
  private splitText(text: string): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    let currentChunk = '';
    let currentSize = 0;

    for (const sentence of sentences) {
      const sentenceWithPunctuation = sentence.trim() + '.';

      if (currentSize + sentenceWithPunctuation.length > this.config.chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());

        // Create overlap
        const words = currentChunk.split(' ');
        const overlapWords = words.slice(-Math.floor(this.config.chunkOverlap / 6));
        currentChunk = overlapWords.join(' ') + ' ';
        currentSize = currentChunk.length;
      }

      currentChunk += sentenceWithPunctuation + ' ';
      currentSize += sentenceWithPunctuation.length + 1;
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Generate embeddings using Grok API
   */
  private async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const batchSize = 10;
    const embeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);

      try {
        const response = await this.grokClient.createEmbeddings({
          input: batch,
        });

        embeddings.push(...response.data.map(item => item.embedding));

        // Small delay to avoid rate limits
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        if (error instanceof RateLimitError) {
          console.warn(`[Grok RAG] Rate limit hit, waiting ${error.retryAfter || 60}s`);
          await new Promise(resolve => setTimeout(resolve, (error.retryAfter || 60) * 1000));
          // Retry this batch
          i -= batchSize;
          continue;
        }
        throw error;
      }
    }

    return embeddings;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Process a PDF file and create document chunks with embeddings
   */
  async processPDFForRAG(
    fileUrl: string,
    materialId: string,
    materialTitle: string,
    courseId: string
  ): Promise<{ success: boolean; chunksCreated: number; error?: string }> {
    try {
      console.log(`[Grok RAG] Processing PDF for material: ${materialTitle}`);

      // Download and parse PDF
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const pdfData = await parsePdfBuffer(Buffer.from(buffer));

      if (!pdfData.text || pdfData.text.trim().length === 0) {
        throw new Error("No text content found in PDF");
      }

      console.log(`[Grok RAG] Extracted ${pdfData.text.length} characters from PDF`);

      // Split text into chunks
      const textChunks = this.splitText(pdfData.text);
      console.log(`[Grok RAG] Created ${textChunks.length} chunks`);

      // Generate embeddings using Grok
      const embeddings = await this.generateEmbeddings(textChunks);
      console.log(`[Grok RAG] Generated ${embeddings.length} embeddings`);

      // Delete existing chunks for this material
      await prisma.materialChunk.deleteMany({
        where: { materialId },
      });

      // Save chunks to database
      const chunkData = textChunks.map((chunk, index) => ({
        id: `${materialId}_chunk_${index}`,
        materialId,
        content: chunk,
        embedding: embeddings[index],
        chunkIndex: index,
        metadata: {
          materialTitle,
          courseId,
          source: fileUrl,
          chunkIndex: index,
        },
      }));

      await prisma.materialChunk.createMany({
        data: chunkData,
      });

      // Update material status
      await prisma.material.update({
        where: { id: materialId },
        data: {
          processed: true,
          processingStatus: "completed",
        },
      });

      console.log(`[Grok RAG] Successfully processed material: ${materialTitle}`);

      return {
        success: true,
        chunksCreated: textChunks.length,
      };
    } catch (error) {
      console.error("[Grok RAG] PDF processing error:", error);

      // Update material status to failed
      await prisma.material.update({
        where: { id: materialId },
        data: { 
          processingStatus: "failed",
        },
      }).catch(err => console.error("[Grok RAG] Failed to update material status:", err));

      return {
        success: false,
        chunksCreated: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Find relevant chunks using vector similarity
   */
  private async findRelevantChunks(
    query: string,
    courseId?: string
  ): Promise<Array<{
    content: string;
    metadata: DocumentChunk['metadata'];
    relevanceScore: number;
  }>> {
    try {
      // Generate query embedding using Grok
      const queryResponse = await this.grokClient.createEmbeddings({
        input: query,
      });

      const queryEmbedding = queryResponse.data[0].embedding;

      // Get chunks from database
      const whereClause = courseId ? { material: { courseId } } : {};

      const chunks = await prisma.materialChunk.findMany({
        where: whereClause,
        include: {
          material: {
            select: {
              id: true,
              title: true,
              courseId: true,
              fileUrl: true,
            }
          }
        }
      });

      if (chunks.length === 0) {
        throw new Error("No processed materials found");
      }

      // Calculate similarities
      const chunksWithSimilarity = chunks.map(chunk => {
        const similarity = this.cosineSimilarity(queryEmbedding, chunk.embedding);

        return {
          content: chunk.content,
          metadata: {
            materialId: chunk.materialId,
            materialTitle: chunk.material.title,
            courseId: chunk.material.courseId,
            chunkIndex: chunk.chunkIndex,
            source: chunk.material.fileUrl,
          },
          relevanceScore: similarity,
        };
      });

      // Sort by similarity and filter by threshold
      return chunksWithSimilarity
        .filter(chunk => chunk.relevanceScore >= this.config.similarityThreshold)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, this.config.maxResults);

    } catch (error) {
      console.error('[Grok RAG] Error finding relevant chunks:', error);
      return [];
    }
  }

  /**
   * Generate response using Grok chat completion
   */
  private async generateResponse(
    query: string,
    relevantChunks: Array<{ content: string; metadata: DocumentChunk['metadata']; relevanceScore: number }>,
    chatHistory: ChatHistory[] = []
  ): Promise<{ answer: string; followUpQuestions: string[] }> {
    try {
      // Build context from relevant chunks
      let context = '';
      let currentLength = 0;

      for (const chunk of relevantChunks) {
        const chunkText = `[From: ${chunk.metadata.materialTitle}]\n${chunk.content}\n\n`;

        if (currentLength + chunkText.length > this.config.maxContextLength) {
          break;
        }

        context += chunkText;
        currentLength += chunkText.length;
      }

      // Build chat history context
      let historyContext = '';
      if (chatHistory.length > 0) {
        historyContext = '\n\nRecent conversation:\n';
        chatHistory.slice(-3).forEach(chat => {
          historyContext += `Human: ${chat.human}\nAssistant: ${chat.ai}\n\n`;
        });
      }

      const systemPrompt = `You are an expert AI tutor helping students learn from their course materials.
Use the provided context to answer the student's question accurately and helpfully.

Guidelines:
- Base your answer primarily on the provided context
- Be educational and explain concepts clearly
- If the context doesn't fully answer the question, say so clearly
- Keep responses concise but comprehensive
- Always mention which material you're referencing
- Suggest follow-up questions that would help the student learn more

Context from course materials:
${context}${historyContext}`;

      const response = await this.grokClient.createChatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.1,
        max_tokens: 800,
      });

      const answer = response.choices[0].message.content ||
        "I'm sorry, I couldn't generate a response. Please try rephrasing your question.";

      // Generate follow-up questions
      const followUpQuestions = await this.generateFollowUpQuestions(query, answer, relevantChunks);

      return {
        answer,
        followUpQuestions,
      };

    } catch (error) {
      console.error('[Grok RAG] Error generating response:', error);
      
      // Provide graceful fallback
      if (error instanceof GrokAPIError || error instanceof TimeoutError) {
        return {
          answer: "I'm experiencing connectivity issues with the AI service. Please try again in a moment. If the problem persists, the service may be temporarily unavailable.",
          followUpQuestions: [],
        };
      }

      return {
        answer: "I'm sorry, I encountered an error while processing your question. Please try again.",
        followUpQuestions: [],
      };
    }
  }

  /**
   * Generate contextual follow-up questions using Grok
   */
  private async generateFollowUpQuestions(
    originalQuery: string,
    answer: string,
    relevantChunks: Array<{ metadata: DocumentChunk['metadata'] }>
  ): Promise<string[]> {
    try {
      if (relevantChunks.length === 0) return [];

      const materials = Array.from(new Set(relevantChunks.map(chunk => chunk.metadata.materialTitle)));

      const prompt = `Based on this educational Q&A, suggest 3 relevant follow-up questions:

Original Question: ${originalQuery}
Answer: ${answer}
Materials: ${materials.slice(0, 2).join(', ')}

Generate 3 specific, educational follow-up questions that would help the student learn more about this topic.`;

      const response = await this.grokClient.createChatCompletion({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
      });

      const suggestions = response.choices[0].message.content
        ?.split('\n')
        .filter(line => line.trim().match(/^\d+\./) || line.trim().startsWith('-'))
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
        .filter(q => q.length > 10)
        .slice(0, 3) || [];

      return suggestions.length > 0 ? suggestions : [
        "Can you explain this concept further?",
        "What are some practical applications?",
        "Are there related topics I should study?"
      ];

    } catch (error) {
      console.error('[Grok RAG] Error generating follow-up questions:', error);
      return [
        "Can you explain this concept further?",
        "What are some practical applications?",
        "Are there related topics I should study?"
      ];
    }
  }

  /**
   * Query the RAG system with conversation history
   */
  async queryWithHistory(
    question: string,
    chatHistory: ChatHistory[] = [],
    courseId?: string
  ): Promise<RAGResponse> {
    try {
      console.log(`[Grok RAG] Processing query: ${question.substring(0, 50)}...`);

      // Find relevant chunks
      const relevantChunks = await this.findRelevantChunks(question, courseId);

      if (relevantChunks.length === 0) {
        return {
          answer: "I don't have any relevant information to answer your question. Please make sure some materials have been uploaded and processed for this course.",
          sourceDocuments: [],
          followUpQuestions: [
            "How do I upload course materials?",
            "What file formats are supported?",
            "How long does material processing take?"
          ]
        };
      }

      console.log(`[Grok RAG] Found ${relevantChunks.length} relevant chunks`);

      // Generate response using Grok
      const response = await this.generateResponse(question, relevantChunks, chatHistory);

      return {
        answer: response.answer,
        sourceDocuments: relevantChunks,
        followUpQuestions: response.followUpQuestions,
      };

    } catch (error) {
      console.error('[Grok RAG] Query error:', error);
      
      // Graceful fallback for API failures
      if (error instanceof RateLimitError) {
        return {
          answer: "The AI service is currently experiencing high demand. Please try again in a few moments.",
          sourceDocuments: [],
          followUpQuestions: [],
        };
      }

      if (error instanceof TimeoutError) {
        return {
          answer: "The request timed out. Please try again with a shorter question or check your connection.",
          sourceDocuments: [],
          followUpQuestions: [],
        };
      }

      return {
        answer: "I'm sorry, I encountered an error while processing your question. Please try again or rephrase your question.",
        sourceDocuments: [],
      };
    }
  }

  /**
   * Get course statistics
   */
  async getCourseStats(courseId?: string): Promise<{
    totalMaterials: number;
    processedMaterials: number;
    totalChunks: number;
    averageChunksPerMaterial: number;
  }> {
    const whereClause = courseId ? { courseId } : {};

    const [materials, chunks] = await Promise.all([
      prisma.material.findMany({
        where: whereClause,
        select: {
          id: true,
          processed: true,
        }
      }),
      prisma.materialChunk.count({
        where: courseId ? { material: { courseId } } : {}
      })
    ]);

    const processedMaterials = materials.filter(m => m.processed).length;

    return {
      totalMaterials: materials.length,
      processedMaterials,
      totalChunks: chunks,
      averageChunksPerMaterial: processedMaterials > 0 ? chunks / processedMaterials : 0,
    };
  }
}

// Singleton instance
let grokRagPipelineInstance: GrokRAGPipeline | null = null;

export function getGrokRAGPipeline(): GrokRAGPipeline {
  if (!grokRagPipelineInstance) {
    grokRagPipelineInstance = new GrokRAGPipeline();
  }
  return grokRagPipelineInstance;
}

export default GrokRAGPipeline;
