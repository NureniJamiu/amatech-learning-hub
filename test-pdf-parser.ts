/**
 * Test PDF parser directly
 * Run with: npx tsx test-pdf-parser.ts
 */

async function testPDFParser() {
    console.log('🚀 Testing PDF parser directly...\n');

    try {
        // Test 1: Import the parser
        console.log('📦 Step 1: Importing PDF parser...');
        const { parsePdfBuffer } = await import('./src/lib/pdf-parser');
        console.log('✅ PDF parser imported successfully\n');

        // Test 2: Test with a real PDF URL
        console.log('📥 Step 2: Testing with real PDF...');
        const testUrl = 'https://res.cloudinary.com/dasjswerc/raw/upload/v1754670164/amatech-materials/fdes1zgwqtr6fxiuqicc.pdf';

        const response = await fetch(testUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        console.log(`✅ PDF downloaded: ${buffer.byteLength} bytes\n`);

        // Test 3: Parse the PDF
        console.log('📖 Step 3: Parsing PDF...');
        const result = await parsePdfBuffer(Buffer.from(buffer));

        console.log(`✅ PDF parsed successfully:`);
        console.log(`   - Pages: ${result.numpages}`);
        console.log(`   - Text length: ${result.text.length} characters`);
        console.log(`   - Text preview: "${result.text.substring(0, 100)}..."`);

        console.log('\n🎉 PDF parser test completed successfully!');
        console.log('The PDF processing should now work correctly in the application.');

    } catch (error) {
        console.log('\n❌ PDF parser test failed:');
        console.error(error);
        process.exit(1);
    }
}

// Run the test
testPDFParser()
    .then(() => {
        console.log('\n✅ PDF parser is working correctly!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });
