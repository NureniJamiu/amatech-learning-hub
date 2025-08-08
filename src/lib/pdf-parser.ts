// Server-side only PDF parser wrapper using pdfjs-dist
import { Buffer } from "buffer";

let pdfjsLib: any = null;

async function initializePdfJs() {
    if (typeof window !== "undefined") {
        throw new Error("PDF parsing is only available on the server side");
    }

    if (!pdfjsLib) {
        try {
            // Use pdfjs-dist which is more stable and doesn't have the debug mode issues
            const pdfjs = await import("pdfjs-dist");
            pdfjsLib = pdfjs;

            // Configure worker path for server-side usage
            if (pdfjsLib.GlobalWorkerOptions) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = null;
            }
        } catch (error) {
            console.error("Failed to load pdfjs-dist:", error);
            throw new Error("PDF parsing library is not available");
        }
    }
    return pdfjsLib;
}

export async function parsePdfBuffer(
    buffer: Buffer
): Promise<{ text: string; numpages: number; info: any; metadata: any }> {
    const pdfjs = await initializePdfJs();

    try {
        // Load the PDF document
        const loadingTask = pdfjs.getDocument({
            data: buffer,
            useSystemFonts: true,
        });

        const pdf = await loadingTask.promise;
        let fullText = "";

        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            // Combine text items into a single string
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(" ");

            fullText += pageText + "\n";
        }

        return {
            text: fullText.trim(),
            numpages: pdf.numPages,
            info: pdf.info || {},
            metadata: pdf.metadata || {},
        };
    } catch (error) {
        console.error("PDF parsing error:", error);
        throw new Error(
            `Failed to parse PDF: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}
