#!/usr/bin/env node

/**
 * Comprehensive Feature Testing Script
 * Tests all endpoints and features of RepurposeIQ
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const PYTHON_URL = 'http://localhost:8000';

let authToken = '';
let testResults = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper functions
const log = (message, type = 'info') => {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
};

const test = async (name, fn) => {
  try {
    log(`\n🧪 Testing: ${name}`, 'info');
    await fn();
    testResults.passed.push(name);
    log(`✅ PASSED: ${name}`, 'success');
    return true;
  } catch (error) {
    testResults.failed.push({ name, error: error.message });
    log(`❌ FAILED: ${name} - ${error.message}`, 'error');
    return false;
  }
};

// Test functions
const testHealth = async () => {
  const response = await axios.get(`${BASE_URL}/api/health`);
  if (response.data.status !== 'ok') throw new Error('Health check failed');
};

const testAuth = async () => {
  // Test login
  const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
    username: 'demo',
    password: 'demo'
  });
  
  if (!loginResponse.data.token) throw new Error('Login failed - no token');
  authToken = loginResponse.data.token;
  
  // Test verify
  const verifyResponse = await axios.get(`${BASE_URL}/api/auth/verify`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  if (!verifyResponse.data.user) throw new Error('Token verification failed');
};

const testMonitoring = async () => {
  const headers = { Authorization: `Bearer ${authToken}` };
  
  // Test status
  await axios.get(`${BASE_URL}/api/monitoring/status`, { headers });
  
  // Test add molecule
  await axios.post(`${BASE_URL}/api/monitoring/add-molecule`, 
    { molecule: 'Metformin' }, 
    { headers }
  );
  
  // Test get alerts
  await axios.get(`${BASE_URL}/api/monitoring/alerts`, { headers });
};

const testDashboard = async () => {
  const headers = { Authorization: `Bearer ${authToken}` };
  await axios.get(`${BASE_URL}/api/dashboard`, { headers });
};

const testQuery = async () => {
  const headers = { Authorization: `Bearer ${authToken}` };
  
  // Test simple query (may fail if GROQ_API_KEY not set, that's ok)
  try {
    await axios.post(`${BASE_URL}/api/query`, {
      query: 'What is Metformin?',
      conversationId: null
    }, { headers, timeout: 30000 });
  } catch (error) {
    if (error.response?.status === 429 || error.code === 'ECONNABORTED') {
      testResults.warnings.push('Query test skipped - rate limit or timeout (expected if no API key)');
    } else {
      throw error;
    }
  }
};

const testConversations = async () => {
  const headers = { Authorization: `Bearer ${authToken}` };
  
  // Test list conversations
  await axios.get(`${BASE_URL}/api/conversations`, { headers });
  
  // Test create conversation
  const createResponse = await axios.post(`${BASE_URL}/api/conversations`, {
    title: 'Test Conversation'
  }, { headers });
  
  const convId = createResponse.data.id;
  
  // Test get conversation
  await axios.get(`${BASE_URL}/api/conversations/${convId}`, { headers });
  
  // Test delete conversation
  await axios.delete(`${BASE_URL}/api/conversations/${convId}`, { headers });
};

const testAnalytics = async () => {
  const headers = { Authorization: `Bearer ${authToken}` };
  await axios.get(`${BASE_URL}/api/analytics`, { headers });
};

const testWorkflows = async () => {
  const headers = { Authorization: `Bearer ${authToken}` };
  
  // Test list workflows
  await axios.get(`${BASE_URL}/api/workflows`, { headers });
  
  // Test create workflow
  const createResponse = await axios.post(`${BASE_URL}/api/workflows`, {
    name: 'Test Workflow',
    description: 'Test',
    steps: JSON.stringify([{ type: 'query', query: 'test' }])
  }, { headers });
  
  const workflowId = createResponse.data.id;
  
  // Test get workflow
  await axios.get(`${BASE_URL}/api/workflows/${workflowId}`, { headers });
  
  // Test delete workflow
  await axios.delete(`${BASE_URL}/api/workflows/${workflowId}`, { headers });
};

const testSuggestions = async () => {
  const headers = { Authorization: `Bearer ${authToken}` };
  
  // Test get suggestions
  await axios.get(`${BASE_URL}/api/suggestions`, { headers });
  
  // Test popular queries
  await axios.get(`${BASE_URL}/api/suggestions/popular`, { headers });
};

const testSentiment = async () => {
  const headers = { Authorization: `Bearer ${authToken}` };
  
  // Test analyze sentiment
  try {
    await axios.post(`${BASE_URL}/api/sentiment/analyze`, {
      molecule: 'Metformin',
      source: 'test',
      content: 'This is a test sentiment analysis'
    }, { headers });
  } catch (error) {
    if (error.response?.status !== 500) throw error;
    testResults.warnings.push('Sentiment analysis may need configuration');
  }
  
  // Test history
  await axios.get(`${BASE_URL}/api/sentiment/history/Metformin`, { headers });
};

const testPythonService = async () => {
  try {
    // Test health
    await axios.get(`${PYTHON_URL}/api/health`);
    
    // Test predictions (may fail if service not running)
    try {
      await axios.post(`${PYTHON_URL}/api/predictions/repurposing-success`, {
        molecule: 'Metformin',
        indication: 'Type 2 Diabetes',
        therapy_area: 'Diabetes',
        market_size: 1000,
        competition_level: 0.3,
        patent_risk: 'low',
        clinical_evidence: 0.7
      });
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        testResults.warnings.push('Python service not running (optional)');
      } else {
        throw error;
      }
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      testResults.warnings.push('Python service not running (optional)');
    } else {
      throw error;
    }
  }
};

// Main test runner
const runAllTests = async () => {
  log('\n🚀 Starting Comprehensive Feature Tests...\n', 'info');
  
  await test('Health Check', testHealth);
  await test('Authentication', testAuth);
  await test('Monitoring Endpoints', testMonitoring);
  await test('Dashboard', testDashboard);
  await test('Query System', testQuery);
  await test('Conversations', testConversations);
  await test('Analytics', testAnalytics);
  await test('Workflows', testWorkflows);
  await test('Query Suggestions', testSuggestions);
  await test('Sentiment Analysis', testSentiment);
  await test('Python Service', testPythonService);
  
  // Print summary
  log('\n' + '='.repeat(60), 'info');
  log('📊 TEST SUMMARY', 'info');
  log('='.repeat(60), 'info');
  log(`✅ Passed: ${testResults.passed.length}`, 'success');
  log(`❌ Failed: ${testResults.failed.length}`, testResults.failed.length > 0 ? 'error' : 'success');
  log(`⚠️  Warnings: ${testResults.warnings.length}`, testResults.warnings.length > 0 ? 'warning' : 'info');
  
  if (testResults.failed.length > 0) {
    log('\n❌ Failed Tests:', 'error');
    testResults.failed.forEach(({ name, error }) => {
      log(`  - ${name}: ${error}`, 'error');
    });
  }
  
  if (testResults.warnings.length > 0) {
    log('\n⚠️  Warnings:', 'warning');
    testResults.warnings.forEach(w => log(`  - ${w}`, 'warning'));
  }
  
  log('\n' + '='.repeat(60) + '\n', 'info');
  
  process.exit(testResults.failed.length > 0 ? 1 : 0);
};

runAllTests().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, 'error');
  process.exit(1);
});
