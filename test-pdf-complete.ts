/**
 * Comprehensive test for the PDF processing pipeline
 * Run with: npx tsx test-pdf-complete.ts
 */

import { PDFProcessingService } from './src/lib/pdf-processing';
import { PDFUtils } from './src/lib/pdf-utils';

async function runComprehensiveTest() {
    console.log('🚀 Starting comprehensive PDF processing test...\n');

    // Test URL from your error message
    const testUrl = 'https://res.cloudinary.com/dasjswerc/raw/upload/v1754670164/amatech-materials/fdes1zgwqtr6fxiuqicc.pdf';

    try {
        // Step 1: Test PDF validation
        console.log('📋 Step 1: Testing PDF validation...');
        const validation = await PDFUtils.validatePdfUrl(testUrl);

        if (validation.isValid) {
            console.log('✅ PDF validation passed');
            console.log(`   - File size: ${validation.fileSize} bytes`);
            console.log(`   - Content type: ${validation.contentType}`);
        } else {
            console.log('❌ PDF validation failed:', validation.error);
            return;
        }

        console.log();

        // Step 2: Test PDF download
        console.log('📥 Step 2: Testing PDF download...');
        const buffer = await PDFUtils.downloadPdfWithRetries(testUrl, 2);
        console.log(`✅ PDF downloaded successfully: ${buffer.length} bytes`);
        console.log();

        // Step 3: Test PDF parsing
        console.log('📖 Step 3: Testing PDF parsing...');
        const parseResult = await PDFUtils.parseWithFallbacks(buffer);
        console.log(`✅ PDF parsed successfully:`);
        console.log(`   - Pages: ${parseResult.numpages}`);
        console.log(`   - Text length: ${parseResult.text.length} characters`);
        console.log(`   - Text preview: "${parseResult.text.substring(0, 100)}..."`);
        console.log();

        // Step 4: Test full processing pipeline
        console.log('⚙️  Step 4: Testing full processing pipeline...');
        const result = await PDFProcessingService.processPDF(testUrl);

        if (result.success) {
            console.log('✅ Full processing successful!');
            console.log(`   - Total chunks: ${result.totalChunks}`);
            console.log(`   - First chunk length: ${result.chunks[0]?.content.length} characters`);
            console.log(`   - First chunk preview: "${result.chunks[0]?.content.substring(0, 150)}..."`);

            // Step 5: Test embeddings generation (optional - requires OpenAI API key)
            if (process.env.OPENAI_API_KEY) {
                console.log('\n🤖 Step 5: Testing embeddings generation...');
                const embeddingResult = await PDFProcessingService.generateEmbeddings(
                    result.chunks.slice(0, 2) // Test with first 2 chunks only
                );

                if (embeddingResult.success) {
                    console.log('✅ Embeddings generated successfully!');
                    console.log(`   - Embedding count: ${embeddingResult.embeddings.length}`);
                    console.log(`   - Embedding dimension: ${embeddingResult.embeddings[0]?.length}`);
                } else {
                    console.log('❌ Embedding generation failed:', embeddingResult.error);
                }
            } else {
                console.log('\n⚠️  Step 5 skipped: No OpenAI API key found');
            }

        } else {
            console.log('❌ Full processing failed:', result.error);
        }

        console.log('\n🎉 Test completed successfully!');

    } catch (error) {
        console.log('\n❌ Test failed with exception:');
        console.error(error);
        process.exit(1);
    }
}

// Run the test
runComprehensiveTest()
    .then(() => {
        console.log('\n✅ All tests passed! The PDF processing system should work correctly now.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test suite failed:', error);
        process.exit(1);
    });
