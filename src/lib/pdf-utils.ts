/**
 * Robust PDF processing utilities with comprehensive error handling
 */

import { parsePdfBuffer } from './pdf-parser';

export interface PDFValidationResult {
    isValid: boolean;
    fileSize?: number;
    contentType?: string;
    error?: string;
}

export class PDFUtils {
    /**
     * Validate PDF URL and basic accessibility
     */
    static async validatePdfUrl(url: string): Promise<PDFValidationResult> {
        try {
            if (!url || typeof url !== 'string') {
                return { isValid: false, error: 'Invalid URL provided' };
            }

            // Check URL format
            if (!url.match(/^https?:\/\/.+\.(pdf|PDF)(\?.*)?$/)) {
                return { isValid: false, error: 'URL does not appear to be a PDF file' };
            }

            // Make a HEAD request to check file accessibility and type
            const response = await fetch(url, {
                method: 'HEAD',
                headers: {
                    'User-Agent': 'AmatechLearningHub/1.0'
                }
            });

            if (!response.ok) {
                return {
                    isValid: false,
                    error: `PDF not accessible: ${response.status} ${response.statusText}`
                };
            }

            const contentType = response.headers.get('content-type') || '';
            const contentLength = response.headers.get('content-length');

            // Check content type
            if (!contentType.includes('application/pdf') && !contentType.includes('application/octet-stream')) {
                return {
                    isValid: false,
                    error: `Invalid content type: ${contentType}`
                };
            }

            // Check file size (limit to 50MB)
            const fileSize = contentLength ? parseInt(contentLength) : 0;
            if (fileSize > 50 * 1024 * 1024) {
                return {
                    isValid: false,
                    error: `File too large: ${(fileSize / 1024 / 1024).toFixed(2)}MB (max 50MB)`
                };
            }

            return {
                isValid: true,
                fileSize,
                contentType
            };

        } catch (error) {
            return {
                isValid: false,
                error: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    /**
     * Download PDF with retries and timeout
     */
    static async downloadPdfWithRetries(url: string, maxRetries = 3): Promise<Buffer> {
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`Download attempt ${attempt}/${maxRetries} for PDF: ${url}`);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        'User-Agent': 'AmatechLearningHub/1.0',
                        'Accept': 'application/pdf,application/octet-stream,*/*'
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                if (buffer.length === 0) {
                    throw new Error('Downloaded file is empty');
                }

                // Basic PDF header validation
                if (!buffer.toString('ascii', 0, 4).startsWith('%PDF')) {
                    throw new Error('Downloaded file is not a valid PDF');
                }

                console.log(`PDF downloaded successfully: ${buffer.length} bytes`);
                return buffer;

            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown download error');
                console.warn(`Download attempt ${attempt} failed:`, lastError.message);

                if (attempt < maxRetries) {
                    // Exponential backoff: 1s, 2s, 4s
                    const delay = Math.pow(2, attempt - 1) * 1000;
                    console.log(`Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw new Error(`Failed to download PDF after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
    }

    /**
     * Parse PDF with enhanced error handling and fallbacks using LangChain
     */
    static async parseWithFallbacks(buffer: Buffer): Promise<{ text: string; numpages: number; info: any; metadata: any }> {
        try {
            // Validate buffer
            if (!buffer || buffer.length === 0) {
                throw new Error('Empty PDF buffer provided');
            }

            // Check PDF header
            if (!buffer.toString('ascii', 0, 4).startsWith('%PDF')) {
                throw new Error('Invalid PDF file format');
            }

            console.log(`Parsing PDF buffer with LangChain: ${buffer.length} bytes`);

            // Parse with our LangChain-based method
            const result = await parsePdfBuffer(buffer);

            // Validate result
            if (!result.text || result.text.trim().length === 0) {
                throw new Error('No text content extracted from PDF');
            }

            if (result.numpages === 0) {
                throw new Error('PDF appears to have no pages');
            }

            console.log(`LangChain PDF parsing successful: ${result.text.length} characters from ${result.numpages} pages`);

            return result;

        } catch (error) {
            console.error('LangChain PDF parsing failed:', error);
            throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Clean and validate extracted text
     */
    static cleanAndValidateText(text: string): string {
        if (!text || typeof text !== 'string') {
            throw new Error('Invalid text content provided');
        }

        // Remove excessive whitespace and clean up
        let cleaned = text
            .replace(/\r\n/g, '\n')           // Normalize line endings
            .replace(/\r/g, '\n')             // Handle old Mac line endings
            .replace(/\n{3,}/g, '\n\n')       // Limit consecutive newlines
            .replace(/[ \t]{2,}/g, ' ')       // Collapse multiple spaces/tabs
            .replace(/^\s+|\s+$/gm, '')       // Trim each line
            .trim();                          // Trim overall

        // Validate meaningful content
        if (cleaned.length < 10) {
            throw new Error('Extracted text is too short to be meaningful');
        }

        // Check for garbled text (too many non-alphanumeric characters)
        const alphanumericRatio = (cleaned.match(/[a-zA-Z0-9\s]/g) || []).length / cleaned.length;
        if (alphanumericRatio < 0.7) {
            console.warn('Warning: PDF text may be garbled or contain many special characters');
        }

        return cleaned;
    }
}
