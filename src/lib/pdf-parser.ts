// Server-side only PDF parser wrapper
import { Buffer } from 'buffer';

let pdfParseModule: any = null;

async function initializePdfParse() {
  if (typeof window !== 'undefined') {
    throw new Error('PDF parsing is only available on the server side');
  }

  if (!pdfParseModule) {
    try {
      // Use require() instead of dynamic import to avoid module.parent issues
      const pdfParse = require('pdf-parse');
      pdfParseModule = pdfParse;
    } catch (error) {
      console.error('Failed to load pdf-parse:', error);
      throw new Error('PDF parsing library is not available');
    }
  }
  return pdfParseModule;
}

export async function parsePdfBuffer(buffer: Buffer): Promise<{ text: string; numpages: number; info: any; metadata: any }> {
  const parser = await initializePdfParse();
  return await parser(buffer);
}
