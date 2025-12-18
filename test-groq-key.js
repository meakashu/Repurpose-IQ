import dotenv from 'dotenv';
import Groq from 'groq-sdk';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Groq API Key...\n');
console.log('='.repeat(60));

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.error('❌ GROQ_API_KEY not found in environment variables');
  console.log('\n💡 Make sure .env file exists and contains:');
  console.log('   GROQ_API_KEY=your_key_here');
  process.exit(1);
}

console.log('✅ GROQ_API_KEY found in .env');
console.log('   Key (masked):', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5));
console.log('   Key length:', apiKey.length, 'characters');

// Test the API key
console.log('\n🧪 Testing API key with Groq...');

const groq = new Groq({
  apiKey: apiKey
});

async function testAPI() {
  try {
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello, Groq is working!" if you can read this.'
        }
      ],
      max_completion_tokens: 50
    });

    const content = response.choices[0].message.content;
    
    console.log('\n✅ API KEY IS VALID!');
    console.log('   Response:', content);
    console.log('\n🎉 Groq AI is ready to use!');
    
  } catch (error) {
    console.error('\n❌ API KEY TEST FAILED:');
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error('   Status:', status);
      console.error('   Error:', errorData?.error?.message || error.message);
      
      if (status === 401) {
        console.error('\n💡 The API key is invalid or expired.');
        console.error('   Please:');
        console.error('   1. Check your API key at: https://console.groq.com/');
        console.error('   2. Make sure the key starts with "gsk_"');
        console.error('   3. Verify the key is active and not expired');
        console.error('   4. Update .env file with the correct key');
      } else if (status === 429) {
        console.error('\n💡 Rate limit exceeded. Wait a moment and try again.');
      } else {
        console.error('\n💡 Unexpected error. Check your internet connection.');
      }
    } else {
      console.error('   Error:', error.message);
    }
    
    process.exit(1);
  }
}

testAPI();
