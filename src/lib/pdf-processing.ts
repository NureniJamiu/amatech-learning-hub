import OpenAI from 'openai';
import { parsePdfBuffer } from "./pdf-parser";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface ProcessedChunk {
    content: string;
    chunkIndex: number;
    pageNumber?: number;
    metadata?: any;
}

export interface ProcessingResult {
    chunks: ProcessedChunk[];
    totalChunks: number;
    success: boolean;
    error?: string;
}

/**
 * Service for processing PDF files for RAG
 */
export class PDFProcessingService {
    private static readonly CHUNK_SIZE = 1000; // Characters per chunk
    private static readonly CHUNK_OVERLAP = 200; // Overlap between chunks

    /**
     * Process PDF from URL and extract text chunks
     */
    static async processPDF(fileUrl: string): Promise<ProcessingResult> {
        try {
            console.log("Processing PDF:", fileUrl);

            // Fetch PDF from Cloudinary first
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.statusText}`);
            }

            const buffer = await response.arrayBuffer();

            // Extract text from PDF using our wrapper
            const data = await parsePdfBuffer(Buffer.from(buffer));
            const fullText = data.text;

            if (!fullText || fullText.trim().length === 0) {
                throw new Error("No text content found in PDF");
            }

            // Split text into chunks
            const chunks = this.chunkText(fullText);

            console.log(
                `Successfully processed PDF: ${chunks.length} chunks created`
            );

            return {
                chunks,
                totalChunks: chunks.length,
                success: true,
            };
        } catch (error) {
            console.error("PDF processing failed:", error);
            return {
                chunks: [],
                totalChunks: 0,
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    /**
     * Split text into overlapping chunks
     */
    private static chunkText(text: string): ProcessedChunk[] {
        const chunks: ProcessedChunk[] = [];
        const sentences = text
            .split(/[.!?]+/)
            .filter((s) => s.trim().length > 0);

        let currentChunk = "";
        let chunkIndex = 0;
        let currentSize = 0;

        for (const sentence of sentences) {
            const sentenceWithPunctuation = sentence.trim() + ".";

            // If adding this sentence would exceed chunk size, start a new chunk
            if (
                currentSize + sentenceWithPunctuation.length >
                    this.CHUNK_SIZE &&
                currentChunk.length > 0
            ) {
                chunks.push({
                    content: currentChunk.trim(),
                    chunkIndex,
                });

                // Start new chunk with overlap
                const words = currentChunk.split(" ");
                const overlapWords = words.slice(
                    -Math.floor(this.CHUNK_OVERLAP / 6)
                ); // Approximate overlap
                currentChunk = overlapWords.join(" ") + " ";
                currentSize = currentChunk.length;
                chunkIndex++;
            }

            currentChunk += sentenceWithPunctuation + " ";
            currentSize += sentenceWithPunctuation.length + 1;
        }

        // Add final chunk if it has content
        if (currentChunk.trim().length > 0) {
            chunks.push({
                content: currentChunk.trim(),
                chunkIndex,
            });
        }

        return chunks;
    }

    /**
     * Generate embeddings for text chunks
     */
    static async generateEmbeddings(
        chunks: ProcessedChunk[]
    ): Promise<{ embeddings: number[][]; success: boolean; error?: string }> {
        try {
            console.log(`Generating embeddings for ${chunks.length} chunks`);

            const embeddings: number[][] = [];

            // Process chunks in batches to avoid rate limits
            const batchSize = 10;
            for (let i = 0; i < chunks.length; i += batchSize) {
                const batch = chunks.slice(i, i + batchSize);
                const batchTexts = batch.map((chunk) => chunk.content);

                const response = await openai.embeddings.create({
                    model: "text-embedding-3-small",
                    input: batchTexts,
                });

                embeddings.push(...response.data.map((item) => item.embedding));

                // Small delay between batches
                if (i + batchSize < chunks.length) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            }

            console.log(
                `Successfully generated ${embeddings.length} embeddings`
            );

            return {
                embeddings,
                success: true,
            };
        } catch (error) {
            console.error("Embedding generation failed:", error);
            return {
                embeddings: [],
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    static cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) {
            throw new Error("Vectors must have the same length");
        }

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
}
