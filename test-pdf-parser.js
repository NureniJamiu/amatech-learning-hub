/**
 * Test script to verify PDF parsing works correctly
 * Run this with: node test-pdf-parser.js
 */

const { PDFProcessingService } = require('./src/lib/pdf-processing.ts');

async function testPdfParsing() {
    console.log('Testing PDF parsing with the new implementation...');

    // Test URL from your error message
    const testUrl = 'https://res.cloudinary.com/dasjswerc/raw/upload/v1754670164/amatech-materials/fdes1zgwqtr6fxiuqicc.pdf';

    try {
        console.log('Starting PDF processing test...');
        const result = await PDFProcessingService.processPDF(testUrl);

        if (result.success) {
            console.log('✅ PDF processing successful!');
            console.log(`- Total chunks: ${result.totalChunks}`);
            console.log(`- First chunk preview: ${result.chunks[0]?.content.substring(0, 200)}...`);
        } else {
            console.log('❌ PDF processing failed:');
            console.log(`- Error: ${result.error}`);
        }
    } catch (error) {
        console.log('❌ Test failed with exception:');
        console.error(error);
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    testPdfParsing();
}
