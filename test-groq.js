// Quick Groq API Test Script
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function testGroqAPI() {
    console.log('🧪 Testing Groq API...\n');
    console.log('API Key:', process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 15)}...` : 'NOT SET');

    if (!process.env.GROQ_API_KEY) {
        console.error('❌ GROQ_API_KEY not found in environment');
        process.exit(1);
    }

    try {
        const startTime = Date.now();

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a pharmaceutical industry expert. Respond concisely.'
                },
                {
                    role: 'user',
                    content: 'What is the market size for checkpoint inhibitors in oncology?'
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 200
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        console.log('\n✅ Groq API Test PASSED\n');
        console.log('Model:', chatCompletion.model);
        console.log('Response Time:', responseTime + 'ms');
        console.log('Tokens Used:', chatCompletion.usage.total_tokens);
        console.log('\n📝 Response:');
        console.log(chatCompletion.choices[0].message.content);
        console.log('\n✨ Groq API is fully functional!');

    } catch (error) {
        console.error('\n❌ Groq API Test FAILED\n');
        console.error('Error:', error.message);

        if (error.status === 401) {
            console.error('\n🔑 Authentication Error: Invalid API key');
        } else if (error.status === 429) {
            console.error('\n⚠️ Rate Limit: Too many requests');
        }

        process.exit(1);
    }
}

testGroqAPI();
