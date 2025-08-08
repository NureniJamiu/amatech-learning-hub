/**
 * Test LangChain PDF processing
 * Run with: npx tsx test-langchain-pdf.ts
 */

import { PDFProcessingService } from './src/lib/pdf-processing';

async function testLangChainPDFProcessing() {
    console.log('🚀 Testing LangChain PDF processing...\n');

    // Test URL from your error message
    const testUrl = 'https://res.cloudinary.com/dasjswerc/raw/upload/v1754671198/amatech-materials/poosqerukdpwqwwexmse.pdf';

    try {
        console.log('📋 Testing full PDF processing pipeline with LangChain...');
        const result = await PDFProcessingService.processPDF(testUrl);

        if (result.success) {
            console.log('✅ LangChain PDF processing successful!');
            console.log(`   - Total chunks: ${result.totalChunks}`);
            console.log(`   - First chunk length: ${result.chunks[0]?.content.length} characters`);
            console.log(`   - First chunk preview: "${result.chunks[0]?.content.substring(0, 200)}..."`);

            console.log('\n🎉 LangChain PDF processing works perfectly!');
        } else {
            console.log('❌ PDF processing failed:', result.error);
        }

    } catch (error) {
        console.log('\n❌ Test failed with exception:');
        console.error(error);
        process.exit(1);
    }
}

// Run the test
testLangChainPDFProcessing()
    .then(() => {
        console.log('\n✅ LangChain PDF processing test passed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ LangChain test failed:', error);
        process.exit(1);
    });
