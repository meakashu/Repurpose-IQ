import { chatCompletion } from './server/services/groqService.js';

async function testGroqDirect() {
  console.log('🧪 Testing Groq AI Direct Call\n');
  console.log('='.repeat(60));
  
  try {
    console.log('\n📝 Step 1: Checking GROQ_API_KEY...');
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('❌ GROQ_API_KEY is not set!');
      console.error('   Please set it in your .env file:');
      console.error('   GROQ_API_KEY=your_api_key_here');
      process.exit(1);
    }
    console.log('✅ GROQ_API_KEY is set');
    console.log(`   Key length: ${apiKey.length} characters`);
    console.log(`   Key preview: ${apiKey.substring(0, 10)}...`);
    
    console.log('\n💬 Step 2: Calling Groq AI...');
    console.log('   Query: "What is Metformin used for?"');
    
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful pharmaceutical assistant.'
      },
      {
        role: 'user',
        content: 'What is Metformin used for?'
      }
    ];
    
    const startTime = Date.now();
    const response = await chatCompletion(messages);
    const duration = Date.now() - startTime;
    
    console.log('\n✅ Groq AI Response Received:');
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Response Length: ${response.length} characters`);
    console.log(`   Model: ${process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'}`);
    console.log('\n📄 Response Preview:');
    console.log('   ' + response.substring(0, 300).replace(/\n/g, '\n   ') + '...');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ GROQ AI IS WORKING!');
    console.log('\n📊 Summary:');
    console.log('   ✅ API Key configured');
    console.log('   ✅ Groq API call successful');
    console.log('   ✅ Response received');
    console.log('   ✅ Real AI, not mock data');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('GROQ_API_KEY')) {
      console.error('\n💡 Solution:');
      console.error('   1. Get a Groq API key from: https://console.groq.com/');
      console.error('   2. Add it to your .env file:');
      console.error('      GROQ_API_KEY=your_api_key_here');
      console.error('   3. Restart the server');
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.error('\n💡 Solution:');
      console.error('   Your Groq API key is invalid. Please check:');
      console.error('   1. Is the key correct?');
      console.error('   2. Is the key active?');
      console.error('   3. Get a new key from: https://console.groq.com/');
    } else {
      console.error('\n💡 Solution:');
      console.error('   Check your network connection and Groq API status.');
    }
    
    process.exit(1);
  }
}

// Run the test
testGroqDirect();
