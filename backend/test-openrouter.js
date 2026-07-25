require('dotenv').config({ override: true });
const fetch = require('node-fetch');

const config = {
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-2-7b-chat'
};

async function testOpenRouterConnection() {
  console.log('\n=== OpenRouter Connection Test ===\n');
  
  if (!config.apiKey) {
    console.log('❌ FAIL: OPENROUTER_API_KEY not set in .env');
    return false;
  }
  
  console.log('✓ API Key loaded:', config.apiKey.substring(0, 20) + '...');
  console.log('✓ Model:', config.model);
  console.log('✓ Base URL:', config.baseUrl);
  
  try {
    console.log('\n[1] Sending test request to OpenRouter...');
    
    const response = await fetch(config.baseUrl + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'MedExplain AI'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a medical report analyzer. Respond with valid JSON.' 
          },
          { 
            role: 'user', 
            content: 'Test: Hemoglobin: 14.5 g/dL (normal range: 13.5-17.5). Is this normal? Respond with: {"status":"normal","value":"14.5"}' 
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });
    
    console.log(`[2] Response Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ SUCCESS: Connection is working!\n');
      console.log('Response from AI:');
      console.log(data.choices[0].message.content.substring(0, 300));
      console.log('\n=== Test Complete ===\n');
      return true;
    } else {
      console.log('\n❌ FAIL: API returned an error\n');
      console.log('Error Details:');
      console.log(JSON.stringify(data, null, 2));
      console.log('\n=== Test Complete ===\n');
      return false;
    }
  } catch (err) {
    console.log('\n❌ FAIL: Connection error\n');
    console.log('Error:', err.message);
    console.log('\n=== Test Complete ===\n');
    return false;
  }
}

testOpenRouterConnection().then(success => {
  process.exit(success ? 0 : 1);
});
