/**
 * Test Grok API Connection
 * 
 * Simple script to test the Grok API connection and verify credentials
 * Run with: pnpm tsx scripts/test-grok-connection.ts
 */

import { GrokClient } from '../src/lib/grok-client';

async function testGrokConnection() {
  console.log('🔍 Testing Grok API connection...\n');

  try {
    const client = new GrokClient();

    // Test 1: Embedding generation
    console.log('Test 1: Generating embeddings...');
    const embeddingResponse = await client.createEmbeddings({
      input: 'Hello, this is a test message for embedding generation.',
    });
    console.log('✅ Embeddings generated successfully');
    console.log(`   - Model: ${embeddingResponse.model}`);
    console.log(`   - Embedding dimension: ${embeddingResponse.data[0].embedding.length}`);
    console.log(`   - Tokens used: ${embeddingResponse.usage.total_tokens}\n`);

    // Test 2: Chat completion
    console.log('Test 2: Generating chat completion...');
    const chatResponse = await client.createChatCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "Hello, Grok API is working!" in a friendly way.' },
      ],
      max_tokens: 50,
    });
    console.log('✅ Chat completion generated successfully');
    console.log(`   - Model: ${chatResponse.model}`);
    console.log(`   - Response: ${chatResponse.choices[0].message.content}`);
    console.log(`   - Tokens used: ${chatResponse.usage.total_tokens}\n`);

    // Test 3: Batch embeddings
    console.log('Test 3: Generating batch embeddings...');
    const batchResponse = await client.createEmbeddings({
      input: [
        'First test sentence',
        'Second test sentence',
        'Third test sentence',
      ],
    });
    console.log('✅ Batch embeddings generated successfully');
    console.log(`   - Number of embeddings: ${batchResponse.data.length}`);
    console.log(`   - Total tokens used: ${batchResponse.usage.total_tokens}\n`);

    console.log('🎉 All tests passed! Grok API is working correctly.\n');
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Response:', error.response);
    }
    
    console.error('\nPlease check:');
    console.error('  1. GROK_API_KEY is set in your .env file');
    console.error('  2. API key is valid and starts with "xai-"');
    console.error('  3. You have internet connectivity');
    console.error('  4. Grok API service is available\n');
    
    process.exit(1);
  }
}

// Run the test
testGrokConnection();
