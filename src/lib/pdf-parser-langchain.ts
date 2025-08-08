// Server-side PDF parser using LangChain PDFLoader (production-ready)
import { Buffer } from "buffer";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { writeFileSync, unlinkSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

/**
 * Parse PDF buffer and extract text content using LangChain PDFLoader
 * This is a production-ready solution that handles PDFs reliably
 */
export async function parsePdfBuffer(
    buffer: Buffer
): Promise<{ text: string; numpages: number; info: any; metadata: any }> {
    // Ensure we're running on server side
    if (typeof window !== "undefined") {
        throw new Error("PDF parsing is only available on the server side");
    }

    // Validate input
    if (!buffer || buffer.length === 0) {
        throw new Error("Invalid or empty PDF buffer provided");
    }

    // Basic PDF format validation
    const header = buffer.toString('ascii', 0, 5);
    if (!header.startsWith('%PDF-')) {
        throw new Error("Invalid PDF file format - missing PDF header");
    }

    let tempFilePath: string | null = null;

    try {
        console.log(`Starting LangChain PDF parsing for buffer of ${buffer.length} bytes...`);

        // Create a temporary file for LangChain PDFLoader
        const tempDir = join(tmpdir(), 'amatech-pdf-processing');
        try {
            mkdirSync(tempDir, { recursive: true });
        } catch (error) {
            // Directory might already exist, ignore error
        }

        tempFilePath = join(tempDir, `pdf-${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`);

        // Write buffer to temporary file
        writeFileSync(tempFilePath, buffer);
        console.log(`Temporary PDF file created: ${tempFilePath}`);

        // Use LangChain PDFLoader to parse the PDF
        const loader = new PDFLoader(tempFilePath, {
            splitPages: false, // We want all content in one document
            parsedItemSeparator: " ", // Separate parsed items with space
        });

        console.log("Loading PDF with LangChain PDFLoader...");
        const docs = await loader.load();

        if (!docs || docs.length === 0) {
            throw new Error("PDF loading returned no documents");
        }

        // Combine all document content
        const fullText = docs.map(doc => doc.pageContent).join('\n').trim();

        if (!fullText || fullText.length === 0) {
            throw new Error("PDF contains no readable text content");
        }

        // Extract metadata
        const metadata = docs[0]?.metadata || {};
        const pageCount = metadata.pdf?.totalPages || docs.length || 1;

        console.log(`PDF parsed successfully with LangChain: ${pageCount} pages, ${fullText.length} characters`);

        return {
            text: fullText,
            numpages: pageCount,
            info: metadata.pdf || {},
            metadata: metadata,
        };

    } catch (error) {
        console.error("LangChain PDF parsing error:", error);

        // Provide more specific error context
        if (error instanceof Error) {
            if (error.message.includes('Invalid PDF structure')) {
                throw new Error("PDF file appears to be corrupted or invalid");
            } else if (error.message.includes('Password') || error.message.includes('encrypted')) {
                throw new Error("PDF file is password protected or encrypted");
            } else if (error.message.includes('memory') || error.message.includes('heap')) {
                throw new Error("PDF file is too large to process");
            } else if (error.message.includes('No such file')) {
                throw new Error("Failed to create temporary file for PDF processing");
            } else {
                throw new Error(`PDF parsing failed: ${error.message}`);
            }
        } else {
            throw new Error("PDF parsing failed due to unknown error");
        }
    } finally {
        // Clean up temporary file
        if (tempFilePath) {
            try {
                unlinkSync(tempFilePath);
                console.log("Temporary PDF file cleaned up");
            } catch (cleanupError) {
                console.warn("Failed to clean up temporary file:", cleanupError);
            }
        }
    }
}
