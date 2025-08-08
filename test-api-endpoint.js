/**
 * Test the actual API endpoint for PDF processing
 * Run with: node test-api-endpoint.js
 */

async function testAPIEndpoint() {
    const API_URL = 'http://localhost:3000/api/v1/materials/process';

    // You'll need to replace this with an actual material ID from your database
    const testPayload = {
        materialId: 'test-material-id' // Replace with real ID
    };

    console.log('🧪 Testing PDF processing API endpoint...');
    console.log(`URL: ${API_URL}`);
    console.log(`Payload:`, testPayload);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testPayload)
        });

        const result = await response.json();

        console.log(`\nResponse Status: ${response.status}`);
        console.log('Response Body:', JSON.stringify(result, null, 2));

        if (response.ok && result.success) {
            console.log('\n✅ API endpoint test successful!');
            console.log(`Chunks created: ${result.chunksCreated}`);
        } else {
            console.log('\n❌ API endpoint test failed');
            console.log(`Error: ${result.error || 'Unknown error'}`);
        }

    } catch (error) {
        console.error('\n❌ Failed to call API endpoint:', error);
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    testAPIEndpoint();
}
