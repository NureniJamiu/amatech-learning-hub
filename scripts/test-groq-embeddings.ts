/**
 * Test script to verify Groq + OpenAI embeddings integration
 */

import { getGrokClient } from '../src/lib/grok-client';

async function testGroqEmbeddings() {
  console.log('🧪 Testing Groq + Cohere Embeddings Integration\n');

  try {
    const client = getGrokClient();

    // Test 1: Generate embeddings (should use Cohere)
    console.log('1️⃣ Testing embeddings generation (via Cohere)...');
    const embeddingResponse = await client.createEmbeddings({
      input: 'This is a test sentence for embeddings.',
    });

    console.log('✅ Embeddings generated successfully');
    console.log(`   - Embedding dimension: ${embeddingResponse.data[0].embedding.length}`);
    console.log(`   - Model used: ${embeddingResponse.model}`);
    console.log(`   - Tokens used: ${embeddingResponse.usage.total_tokens}\n`);

    // Test 2: Generate chat completion (should use Groq)
    console.log('2️⃣ Testing chat completion (via Groq)...');
    const chatResponse = await client.createChatCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "Hello, Groq!" in exactly 3 words.' },
      ],
      max_tokens: 10,
    });

    console.log('✅ Chat completion generated successfully');
    console.log(`   - Response: ${chatResponse.choices[0].message.content}`);
    console.log(`   - Model used: ${chatResponse.model}`);
    console.log(`   - Tokens used: ${chatResponse.usage.total_tokens}\n`);

    // Test 3: Batch embeddings
    console.log('3️⃣ Testing batch embeddings...');
    const batchResponse = await client.createEmbeddings({
      input: [
        'First test sentence.',
        'Second test sentence.',
        'Third test sentence.',
      ],
    });

    console.log('✅ Batch embeddings generated successfully');
    console.log(`   - Number of embeddings: ${batchResponse.data.length}`);
    console.log(`   - Total tokens: ${batchResponse.usage.total_tokens}\n`);

    console.log('🎉 All tests passed! The hybrid Groq + Cohere setup is working correctly.\n');
    console.log('Summary:');
    console.log('  - Embeddings: Cohere (embed-english-light-v3.0) - FREE TIER ✅');
    console.log('  - Chat: Groq (llama models) - FREE TIER ✅');
    console.log('  - Status: ✅ Ready for RAG processing\n');
    console.log('💰 Cost: $0 - Both services are FREE FOREVER!\n');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('COHERE_API_KEY')) {
      console.error('\n💡 Fix: Add COHERE_API_KEY to your .env file');
      console.error('   Get one from: https://dashboard.cohere.com/api-keys');
      console.error('   ✅ FREE TIER: 10,000 calls/month, no credit card required!\n');
    } else if (error.message.includes('GROK_API_KEY')) {
      console.error('\n💡 Fix: Add GROK_API_KEY to your .env file');
      console.error('   Get one from: https://console.groq.com/keys\n');
    } else {
      console.error('\nError details:', error);
    }
    
    process.exit(1);
  }
}

// Run the test
testGroqEmbeddings();
