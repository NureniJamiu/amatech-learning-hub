// Test script to verify content deletion endpoints
const API_BASE = 'http://localhost:3001/api/v1';

async function testDeletionEndpoints() {
  console.log('Testing content deletion endpoints...');

  try {
    // Test materials deletion endpoint (should return 404 for non-existent ID)
    const materialResponse = await fetch(`${API_BASE}/materials/test-id`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Materials deletion endpoint status:', materialResponse.status);
    console.log('Materials deletion response:', await materialResponse.text());

    // Test past questions deletion endpoint (should return 404 for non-existent ID)
    const pqResponse = await fetch(`${API_BASE}/past-questions/test-id`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Past questions deletion endpoint status:', pqResponse.status);
    console.log('Past questions deletion response:', await pqResponse.text());

  } catch (error) {
    console.error('Error testing endpoints:', error);
  }
}

testDeletionEndpoints();
