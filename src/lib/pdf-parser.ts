// Server-side PDF parser using pdf-parse (production-ready)
import { Buffer } from "buffer";

/**
 * Parse PDF buffer and extract text content using pdf-parse
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
    const header = buffer.toString("ascii", 0, 5);
    if (!header.startsWith("%PDF-")) {
        throw new Error("Invalid PDF file format - missing PDF header");
    }

    try {
        console.log(
            `Starting PDF parsing for buffer of ${buffer.length} bytes...`
        );

        // Use eval to avoid bundling issues with pdf-parse
        const pdfParseLib = eval("require")("pdf-parse");

        // Parse PDF using pdf-parse
        const pdfData = await pdfParseLib(buffer);

        if (!pdfData.text || pdfData.text.trim().length === 0) {
            throw new Error("PDF contains no readable text content");
        }

        console.log(
            `PDF parsed successfully: ${pdfData.numpages} pages, ${pdfData.text.length} characters`
        );

        return {
            text: pdfData.text,
            numpages: pdfData.numpages,
            info: pdfData.info || {},
            metadata: {
                pages: pdfData.numpages,
                info: pdfData.info,
                version: pdfData.version,
            },
        };
    } catch (error) {
        console.error("PDF parsing error:", error);

        // Provide more specific error context
        if (error instanceof Error) {
            if (
                error.message.includes("Invalid PDF structure") ||
                error.message.includes("Invalid or corrupted PDF")
            ) {
                throw new Error("PDF file appears to be corrupted or invalid");
            } else if (
                error.message.includes("Password") ||
                error.message.includes("encrypted")
            ) {
                throw new Error("PDF file is password protected or encrypted");
            } else if (
                error.message.includes("memory") ||
                error.message.includes("heap")
            ) {
                throw new Error("PDF file is too large to process");
            } else {
                throw new Error(`PDF parsing failed: ${error.message}`);
            }
        } else {
            throw new Error("PDF parsing failed due to unknown error");
        }
    }
}
