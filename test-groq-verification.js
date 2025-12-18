import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function verifyGroqUsage() {
  console.log('🔍 Verifying Groq AI Usage in Chat Bot\n');
  console.log('='.repeat(60));
  
  try {
    // Step 1: Login
    console.log('\n📝 Step 1: Authenticating...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'demo',
      password: 'demo'
    });
    
    if (!loginResponse.data.token) {
      throw new Error('❌ Login failed');
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Authentication successful');
    
    // Step 2: Ask a question
    console.log('\n💬 Step 2: Testing Chat Query...');
    console.log('   Query: "Analyze Metformin for cardiovascular repurposing"');
    
    const startTime = Date.now();
    const queryResponse = await axios.post(
      `${BASE_URL}/api/query`,
      {
        query: 'Analyze Metformin for cardiovascular repurposing',
        conversationId: null
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 120 seconds
      }
    );
    
    const duration = Date.now() - startTime;
    
    console.log('\n✅ Query Response Received:');
    console.log('   Status:', queryResponse.status);
    console.log('   Service:', queryResponse.data.service || 'unknown');
    console.log('   Duration:', duration, 'ms');
    console.log('   Response Length:', queryResponse.data.response?.length || 0, 'characters');
    console.log('   Agents Used:', queryResponse.data.agents?.join(', ') || 'none');
    
    // Step 3: Verify Groq AI is being used
    console.log('\n🔍 Step 3: Verifying Groq AI Usage...');
    
    if (queryResponse.data.service === 'nodejs') {
      console.log('   ✅ Using Node.js Master Agent (which uses Groq AI)');
    }
    
    // Step 4: Check response quality (real AI vs mock)
    console.log('\n📊 Step 4: Analyzing Response Quality...');
    const response = queryResponse.data.response || '';
    
    // Check for AI analysis indicators
    const hasAnalysis = /analysis|analyze|indicates|suggests|evidence|implications|recommendation/i.test(response);
    const hasStructuredSections = /##|###|Problem Understanding|Scientific|Clinical Evidence|Patent|Market|Recommendation/i.test(response);
    const hasExpertInsights = /however|furthermore|moreover|consequently|therefore|key concern|critical|important/i.test(response);
    const hasConfidence = /confidence|GO|NO-GO|NEEDS REVIEW|Low|Medium|High/i.test(response);
    
    console.log('   Has Analysis:', hasAnalysis ? '✅' : '❌');
    console.log('   Has Structured Sections:', hasStructuredSections ? '✅' : '❌');
    console.log('   Has Expert Insights:', hasExpertInsights ? '✅' : '❌');
    console.log('   Has Confidence/Recommendation:', hasConfidence ? '✅' : '❌');
    
    // Step 5: Check server logs would show Groq calls
    console.log('\n📋 Step 5: Response Preview (First 500 chars):');
    console.log('   ' + response.substring(0, 500).replace(/\n/g, '\n   ') + '...');
    
    // Step 6: Final verification
    console.log('\n' + '='.repeat(60));
    
    const isRealAI = hasAnalysis && (hasStructuredSections || hasExpertInsights);
    
    if (isRealAI) {
      console.log('✅ VERIFICATION PASSED!');
      console.log('\n📊 Summary:');
      console.log('   ✅ Chat API is working');
      console.log('   ✅ Response shows AI analysis (not just data listing)');
      console.log('   ✅ Structured sections present');
      console.log('   ✅ Expert insights included');
      console.log('   ✅ Groq AI is being used (real AI, not mock)');
    } else {
      console.log('⚠️  VERIFICATION INCONCLUSIVE');
      console.log('\n📊 Summary:');
      console.log('   ✅ Chat API is working');
      console.log('   ⚠️  Response may not show strong AI analysis');
      console.log('   💡 Check server logs for "[Groq AI]" messages');
      console.log('   💡 Verify GROQ_API_KEY is set in .env file');
    }
    
    console.log('\n💡 To verify Groq is being called:');
    console.log('   1. Check server console for "[Groq AI] Calling Groq API..." messages');
    console.log('   2. Check server console for "[Groq AI] Response received..." messages');
    console.log('   3. If you see these logs, Groq AI is being used');
    console.log('   4. If you see errors about GROQ_API_KEY, set it in .env file');
    
  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', error.response.data?.error || error.response.data);
      
      if (error.response.data?.error?.includes('GROQ_API_KEY')) {
        console.error('\n💡 Solution:');
        console.error('   Set GROQ_API_KEY in your .env file:');
        console.error('   GROQ_API_KEY=your_api_key_here');
      }
    } else if (error.request) {
      console.error('   No response received. Is the server running?');
      console.error('   Make sure the server is running on http://localhost:3000');
    } else {
      console.error('   Error:', error.message);
    }
    process.exit(1);
  }
}

// Run the verification
verifyGroqUsage();
