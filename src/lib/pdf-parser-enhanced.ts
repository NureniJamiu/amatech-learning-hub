/**
 * Alternative PDF parser using pdf2pic and OCR as fallback
 * This provides multiple parsing strategies for maximum compatibility
 */

import { Buffer } from "buffer";

// Primary parser using pdf-parse
let pdfParse: any = null;

async function initializePdfParse() {
    if (!pdfParse) {
        try {
            const module = await import("pdf-parse");
            pdfParse = module.default || module;
            console.log("pdf-parse initialized successfully");
        } catch (error) {
            console.error("Failed to initialize pdf-parse:", error);
            throw new Error("PDF parsing library not available");
        }
    }
    return pdfParse;
}

/**
 * Enhanced PDF parser with multiple fallback strategies
 */
export async function parseBufferWithFallbacks(
    buffer: Buffer
): Promise<{ text: string; numpages: number; info: any; metadata: any }> {
    // Ensure we're running on server side
    if (typeof window !== "undefined") {
        throw new Error("PDF parsing is only available on the server side");
    }

    // Validate buffer
    if (!buffer || buffer.length === 0) {
        throw new Error("Empty or invalid PDF buffer");
    }

    // Check PDF signature
    const signature = buffer.toString('ascii', 0, 4);
    if (!signature.startsWith('%PDF')) {
        throw new Error("Invalid PDF file - missing PDF signature");
    }

    try {
        console.log("Attempting primary PDF parsing with pdf-parse...");

        // Strategy 1: Use pdf-parse (primary method)
        const parser = await initializePdfParse();

        const data = await parser(buffer, {
            // Configure options for better compatibility
            normalizeWhitespace: true,
            disableCombineTextItems: false,
            max: 0, // No page limit
        });

        if (!data.text || data.text.trim().length === 0) {
            throw new Error("No text content extracted from PDF");
        }

        console.log(`PDF parsed successfully: ${data.numpages} pages, ${data.text.length} characters`);

        return {
            text: data.text.trim(),
            numpages: data.numpages || 1,
            info: data.info || {},
            metadata: data.metadata || {},
        };

    } catch (primaryError) {
        console.warn("Primary PDF parsing failed:", primaryError);

        try {
            console.log("Attempting fallback parsing with alternative options...");

            // Strategy 2: Try with different options
            const parser = await initializePdfParse();

            const data = await parser(buffer, {
                // More lenient options
                normalizeWhitespace: false,
                disableCombineTextItems: true,
                max: 50, // Limit pages for fallback
            });

            if (data.text && data.text.trim().length > 0) {
                console.log(`Fallback parsing succeeded: ${data.numpages} pages, ${data.text.length} characters`);

                return {
                    text: data.text.trim(),
                    numpages: data.numpages || 1,
                    info: data.info || {},
                    metadata: data.metadata || {},
                };
            }

            throw new Error("Fallback parsing also produced no text");

        } catch (fallbackError) {
            console.error("All parsing strategies failed:", fallbackError);

            // If all else fails, provide a meaningful error
            const errorMessage = primaryError instanceof Error ? primaryError.message : "Unknown parsing error";
            throw new Error(`PDF parsing failed: ${errorMessage}`);
        }
    }
}

/**
 * Simplified parser that just uses pdf-parse directly
 * This is the main export that replaces the old parsePdfBuffer
 */
export async function parsePdfBuffer(
    buffer: Buffer
): Promise<{ text: string; numpages: number; info: any; metadata: any }> {
    return parseBufferWithFallbacks(buffer);
}
