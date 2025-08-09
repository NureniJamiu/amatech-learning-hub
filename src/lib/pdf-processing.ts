import OpenAI from 'openai';
import { parsePdfBuffer } from "./pdf-parser";
import { PDFUtils } from "./pdf-utils";

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
     * Process PDF from URL and extract text chunks with enhanced error handling
     */
    static async processPDF(fileUrl: string): Promise<ProcessingResult> {
        try {
            // Step 1: Validate PDF URL and accessibility
            const validation = await PDFUtils.validatePdfUrl(fileUrl);
            if (!validation.isValid) {
                throw new Error(`PDF validation failed: ${validation.error}`);
            }

            console.log(
                `PDF validation passed: ${validation.fileSize} bytes, type: ${validation.contentType}`
            );

            // Step 2: Download PDF with retries
            console.log("Downloading PDF...");
            const buffer = await PDFUtils.downloadPdfWithRetries(fileUrl, 3);

            // Step 3: Parse PDF with enhanced error handling
            console.log("Parsing PDF content...");
            const data = await PDFUtils.parseWithFallbacks(buffer);

            // Step 4: Clean and validate extracted text
            console.log("Cleaning and validating text...");
            const cleanedText = PDFUtils.cleanAndValidateText(data.text);

            console.log(
                `Text processing completed: ${cleanedText.length} characters from ${data.numpages} pages`
            );

            // Step 5: Split text into chunks
            console.log("Creating text chunks...");
            const chunks = this.chunkText(cleanedText);

            console.log(
                `Successfully processed PDF: ${chunks.length} chunks created from ${data.numpages} pages`
            );

            return {
                chunks,
                totalChunks: chunks.length,
                success: true,
            };
        } catch (error) {
            console.error("PDF processing failed:", error);

            // Provide more specific error messages
            let errorMessage = "Unknown error occurred during PDF processing";

            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    errorMessage =
                        "PDF download timed out - file may be too large or server unresponsive";
                } else if (error.message.includes("validation failed")) {
                    errorMessage = `PDF validation error: ${error.message}`;
                } else if (error.message.includes("download")) {
                    errorMessage = `PDF download failed: ${error.message}`;
                } else if (error.message.includes("parsing failed")) {
                    errorMessage = `PDF parsing error: ${error.message}`;
                } else if (error.message.includes("text")) {
                    errorMessage = `Text extraction error: ${error.message}`;
                } else {
                    errorMessage = error.message;
                }
            }

            return {
                chunks: [],
                totalChunks: 0,
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * Split text into overlapping chunks with improved algorithm
     */
    private static chunkText(text: string): ProcessedChunk[] {
        const chunks: ProcessedChunk[] = [];

        // Clean up the text first
        const cleanedText = text
            .replace(/\s+/g, " ") // Replace multiple whitespace with single space
            .replace(/\n+/g, "\n") // Replace multiple newlines with single newline
            .trim();

        // Split by sentences first, then paragraphs if sentences are too long
        let sentences = cleanedText
            .split(/[.!?]+/)
            .filter((s) => s.trim().length > 10) // Filter out very short fragments
            .map((s) => s.trim() + ".");

        // If sentences are too long, split by commas or semicolons
        const expandedSentences: string[] = [];
        for (const sentence of sentences) {
            if (sentence.length > this.CHUNK_SIZE * 0.8) {
                const parts = sentence
                    .split(/[,;]+/)
                    .filter((p) => p.trim().length > 5);
                if (parts.length > 1) {
                    expandedSentences.push(...parts.map((p) => p.trim()));
                } else {
                    expandedSentences.push(sentence);
                }
            } else {
                expandedSentences.push(sentence);
            }
        }

        let currentChunk = "";
        let chunkIndex = 0;

        for (const sentence of expandedSentences) {
            const sentenceToAdd = sentence.endsWith(".")
                ? sentence
                : sentence + ".";

            // Check if adding this sentence would exceed chunk size
            if (
                currentChunk.length + sentenceToAdd.length + 1 >
                    this.CHUNK_SIZE &&
                currentChunk.length > 0
            ) {
                // Save current chunk
                if (currentChunk.trim().length > 50) {
                    // Only save chunks with meaningful content
                    chunks.push({
                        content: currentChunk.trim(),
                        chunkIndex,
                    });
                    chunkIndex++;
                }

                // Start new chunk with overlap
                const words = currentChunk.split(" ");
                const overlapWords = Math.min(
                    Math.floor(this.CHUNK_OVERLAP / 6),
                    words.length
                );
                currentChunk = words.slice(-overlapWords).join(" ") + " ";
            }

            currentChunk += sentenceToAdd + " ";
        }

        // Add final chunk if it has meaningful content
        if (currentChunk.trim().length > 50) {
            chunks.push({
                content: currentChunk.trim(),
                chunkIndex,
            });
        }

        // Ensure we have at least one chunk even if the text is short
        if (chunks.length === 0 && cleanedText.length > 0) {
            chunks.push({
                content: cleanedText,
                chunkIndex: 0,
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
